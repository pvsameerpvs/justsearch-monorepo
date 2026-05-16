import { Router } from 'express';
import { sql, eq, desc } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const allRestaurants = await db.select().from(restaurants).orderBy(desc(restaurants.createdAt));
    const activeSchemas = allRestaurants.filter((r) => r.status === 'active');

    let totalRevenue = 0;
    let totalOrders = 0;
    const revenueMap = new Map<string, { revenue: number; orders: number }>();

    for (const schema of activeSchemas) {
      const orderRows = await db.execute(
        sql`SELECT COUNT(*) as count, COALESCE(SUM(CAST(total AS DECIMAL)), 0) as revenue FROM ${sql.identifier(schema.schemaName)}.orders`
      );
      const data = orderRows[0] as { count: number; revenue: number } | undefined;
      if (data) {
        const orderCount = Number(data.count);
        const revenue = Number(data.revenue);
        totalOrders += orderCount;
        totalRevenue += revenue;
        revenueMap.set(schema.id, { revenue, orders: orderCount });
      }
    }

    const restaurantList = allRestaurants.map((r) => {
      const stats = revenueMap.get(r.id) || { revenue: 0, orders: 0 };
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

    const activeRestaurants = activeSchemas.length;
    const avgRevenue = allRestaurants.length > 0 ? Math.round(totalRevenue / allRestaurants.length) : 0;

    res.json({
      totalRevenue,
      adRevenue: 0,
      subscriptionRevenue: 0,
      activeRestaurants,
      totalOrders,
      totalViews: 0,
      avgRevenuePerRestaurant: avgRevenue,
      growthPercent: 0,
      restaurants: restaurantList,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
