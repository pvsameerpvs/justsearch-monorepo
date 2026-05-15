import { Router } from 'express';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import { orders } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// PATCH /api/v1/orders/:id/payment — driver records payment mode
router.patch('/:id/payment', requireRole('owner', 'manager', 'cashier', 'driver'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const orderId = req.params.id;
    const schema = z.object({
      paymentMethod: z.enum(['cash', 'card']),
      paymentStatus: z.enum(['unpaid', 'paid']).optional(),
    });
    const { paymentMethod, paymentStatus } = schema.parse(req.body);

    const [updated] = await db
      .update(orders)
      .set({
        paymentMethod,
        paymentStatus: paymentStatus || 'paid',
        updatedAt: new Date(),
      })
      .where(and(eq(orders.id, orderId), eq(orders.restaurantId, req.tenant.id)))
      .returning();

    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json({ order: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
