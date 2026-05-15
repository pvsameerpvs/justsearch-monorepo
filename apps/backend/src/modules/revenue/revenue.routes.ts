import { Router } from 'express';
import { desc } from 'drizzle-orm';
import { db } from '../../db';
import { orders, restaurants } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const totalOrders = allOrders.length;

    const map = new Map<string, { revenue: number; orders: number }>();
    for (const o of allOrders) {
      const cur = map.get(o.restaurantId) || { revenue: 0, orders: 0 };
      cur.revenue += Number(o.total);
      cur.orders += 1;
      map.set(o.restaurantId, cur);
    }

    const allRestaurants = await db.select().from(restaurants);
    const activeRestaurants = allRestaurants.filter((r) => r.status === 'active').length;

    const restaurantList = allRestaurants.map((r) => {
      const stats = map.get(r.id) || { revenue: 0, orders: 0 };
      const settings =
        typeof r.settings === 'object' && r.settings !== null
          ? (r.settings as Record<string, unknown>)
          : {};
      return {
        id: r.id,
        name: r.name,
        city: (settings.city as string) || '',
        status: r.status as 'active' | 'draft' | 'suspended',
        orders: stats.orders,
        views: 0,
        adRevenue: 0,
        subscriptionRevenue: 0,
        platformFee: 0,
      };
    });

    res.json({
      totalRevenue,
      adRevenue: 0,
      subscriptionRevenue: 0,
      activeRestaurants,
      totalOrders,
      totalViews: 0,
      avgRevenuePerRestaurant: allRestaurants.length > 0 ? Math.round(totalRevenue / allRestaurants.length) : 0,
      growthPercent: 0,
      restaurants: restaurantList,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
