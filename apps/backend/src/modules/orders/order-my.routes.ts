import { Router } from 'express';
import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../../db';
import { orders, orderItems, restaurants } from '../../db/schema';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

// GET /api/v1/orders/my — list ALL orders for the authenticated customer across all restaurants
router.get('/my', async (req, res, next) => {
  try {
    if (!req.auth?.id) return res.status(401).json({ error: 'Authentication required' });

    const customerId = req.auth.id;

    const rows = await db
      .select({
        order: orders,
        restaurantName: restaurants.name,
      })
      .from(orders)
      .leftJoin(restaurants, eq(orders.restaurantId, restaurants.id))
      .where(eq(orders.customerId, customerId))
      .orderBy(desc(orders.createdAt))
      .limit(100);

    const orderIds = rows.map((r) => r.order.id);
    let allItems: typeof orderItems.$inferSelect[] = [];

    if (orderIds.length > 0) {
      allItems = await db
        .select()
        .from(orderItems)
        .where(sql`${orderItems.orderId} = ANY(${orderIds})`);
    }

    const enriched = rows.map(({ order, restaurantName }) => ({
      order: { ...order, restaurantName },
      items: allItems.filter((item) => item.orderId === order.id),
    }));

    res.json({ orders: enriched });
  } catch (error) {
    next(error);
  }
});

export default router;
