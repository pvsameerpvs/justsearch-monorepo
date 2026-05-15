import { Router } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import { orders, orderItems } from '../../db/schema';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

// GET /api/v1/orders/:id — get order details
router.get('/:id', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const orderId = req.params.id;
    const [order] = await db.select().from(orders).where(
      and(eq(orders.id, orderId), eq(orders.restaurantId, req.tenant.id))
    ).limit(1);

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
    res.json({ order, items });
  } catch (error) {
    next(error);
  }
});

export default router;
