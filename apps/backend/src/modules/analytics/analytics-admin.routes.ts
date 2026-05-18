import { Router } from 'express';
import { sql, eq, desc } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants, advertisements, users, loyaltyPoints } from '../../db/schema';
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

    let totalOrders = 0;
    let totalRevenue = 0;

    for (const schema of schemas) {
      const orderRows = await db.execute(
        sql`SELECT COUNT(*) as count, COALESCE(SUM(CAST(total AS DECIMAL)), 0) as revenue FROM ${sql.identifier(schema.schemaName)}."orders"`
      );
      const orderData = orderRows[0] as { count: number; revenue: number } | undefined;
      if (orderData) {
        totalOrders += Number(orderData.count);
        totalRevenue += Number(orderData.revenue);
      }
    }

    const totalUsersResult = await db.select({ count: sql<number>`count(*)` }).from(users);
    const activeUsersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.isActive, true));

    const totalUsers = totalUsersResult[0]?.count ?? 0;
    const activeUsers = activeUsersResult[0]?.count ?? 0;

    const totalGamePointsResult = await db
      .select({ total: sql<number>`COALESCE(SUM(total_earned), 0)` })
      .from(loyaltyPoints);
    const totalGamePoints = totalGamePointsResult[0]?.total ?? 0;

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
