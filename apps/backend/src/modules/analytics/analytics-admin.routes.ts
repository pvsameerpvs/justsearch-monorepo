import { Router } from 'express';
import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants, advertisements } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/admin/summary', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const schemas = await db
      .select({ schemaName: restaurants.schemaName, id: restaurants.id })
      .from(restaurants)
      .where(eq(restaurants.status, 'active'));

    const allRestaurants = await db.select().from(restaurants).orderBy(desc(restaurants.createdAt));
    const allAds = await db.select().from(advertisements);

    let totalUsers = 0;
    let activeUsers = 0;
    let totalOrders = 0;
    let totalRevenue = 0;
    let totalGamePoints = 0;

    for (const schema of schemas) {
      const userRows = await db.execute(
        sql`SELECT COUNT(*) as count, COALESCE(SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END), 0) as active_count FROM ${sql.identifier(schema.schemaName)}.users`
      );
      const userData = userRows[0] as { count: number; active_count: number } | undefined;
      if (userData) {
        totalUsers += Number(userData.count);
        activeUsers += Number(userData.active_count);
      }

      const orderRows = await db.execute(
        sql`SELECT COUNT(*) as count, COALESCE(SUM(CAST(total AS DECIMAL)), 0) as revenue FROM ${sql.identifier(schema.schemaName)}.orders`
      );
      const orderData = orderRows[0] as { count: number; revenue: number } | undefined;
      if (orderData) {
        totalOrders += Number(orderData.count);
        totalRevenue += Number(orderData.revenue);
      }

      const pointsRows = await db.execute(
        sql`SELECT COALESCE(SUM(total_earned), 0) as points FROM ${sql.identifier(schema.schemaName)}.loyalty_points`
      );
      const pointsData = pointsRows[0] as { points: number } | undefined;
      if (pointsData) {
        totalGamePoints += Number(pointsData.points);
      }
    }

    const activeRestaurants = allRestaurants.filter((r) => r.status === 'active').length;
    const activeCampaigns = allAds.filter((a) => a.isActive).length;

    res.json({
      totalRestaurants: allRestaurants.length,
      activeRestaurants,
      totalUsers,
      activeUsers,
      totalGamePoints,
      totalAdRevenue: 0,
      totalAdImpressions: 0,
      activeCampaigns,
      totalCampaigns: allAds.length,
      totalOrders,
      totalViews: 0,
      avgPointsPerUser: totalUsers > 0 ? Math.round(totalGamePoints / totalUsers) : 0,
      monthlyData: [],
    });
  } catch (error) {
    next(error);
  }
});

export default router;
