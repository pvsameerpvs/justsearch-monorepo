import { Router } from 'express';
import { eq, and, desc, sql, inArray } from 'drizzle-orm';
import { db } from '../../db';
import { orders, orderItems } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/orders — list orders for this restaurant (with optional driverId filter)
router.get('/', requireRole('owner', 'manager', 'cashier', 'kitchen_staff', 'driver'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });

    const driverId = req.query.driverId as string | undefined;

    const conditions = [eq(orders.restaurantId, req.tenant.id)];
    if (driverId) conditions.push(eq(orders.driverId, driverId));

    const orderList = await db
      .select()
      .from(orders)
      .where(and(...conditions))
      .orderBy(desc(orders.createdAt))
      .limit(100);

    const orderIds = orderList.map((o) => o.id);
    let itemsCountMap: Record<string, number> = {};

    if (orderIds.length > 0) {
      const counts = await db
        .select({
          orderId: orderItems.orderId,
          count: sql<number>`COUNT(*)::int`,
        })
        .from(orderItems)
        .where(inArray(orderItems.orderId, orderIds))
        .groupBy(orderItems.orderId);

      for (const c of counts) {
        itemsCountMap[c.orderId] = c.count;
      }
    }

    const enriched = orderList.map((o) => ({
      ...o,
      items: itemsCountMap[o.id] || 0,
    }));

    res.json({ orders: enriched });
  } catch (error) {
    next(error);
  }
});

export default router;
