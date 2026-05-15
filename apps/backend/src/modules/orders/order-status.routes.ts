import { Router } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import { orders } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { updateStatusSchema } from './order.validators';

const router = Router();
router.use(authMiddleware);

// PATCH /api/v1/orders/:id/status — update order status
router.patch('/:id/status', requireRole('owner', 'manager', 'cashier', 'kitchen_staff'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const orderId = req.params.id;
    const { status } = updateStatusSchema.parse(req.body);

    const [updated] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(orders.id, orderId), eq(orders.restaurantId, req.tenant.id)))
      .returning();

    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json({ order: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
