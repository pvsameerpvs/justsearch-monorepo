import { Router } from 'express';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../../db';
import { orders, orderItems } from '../../db/schema';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

// GET /api/v1/orders/my — list orders for the authenticated customer
router.get('/my', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });
    if (!req.auth?.userId) return res.status(401).json({ error: 'Authentication required' });

    const customerId = req.auth.userId;

    const orderList = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, req.tenant.id),
          eq(orders.customerId, customerId)
        )
      )
      .orderBy(desc(orders.createdAt))
      .limit(100);

    const orderIds = orderList.map((o) => o.id);
    let allItems: typeof orderItems.$inferSelect[] = [];

    if (orderIds.length > 0) {
      allItems = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderIds[0]));
      // For multiple orders, we'd need IN clause; postgres-js supports it via sql helper
      // Using a loop for simplicity with Drizzle ORM
      if (orderIds.length > 1) {
        allItems = [];
        for (const id of orderIds) {
          const items = await db
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, id));
          allItems.push(...items);
        }
      }
    }

    const enriched = orderList.map((order) => ({
      order,
      items: allItems.filter((item) => item.orderId === order.id),
    }));

    res.json({ orders: enriched });
  } catch (error) {
    next(error);
  }
});

export default router;
