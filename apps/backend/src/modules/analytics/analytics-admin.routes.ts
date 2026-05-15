import { Router } from 'express';
import { desc, sql } from 'drizzle-orm';
import { db } from '../../db';
import { orders, users, restaurants, advertisements } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/admin/summary', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const allOrders = await db.select().from(orders);
    const allUsers = await db.select().from(users);
    const allRestaurants = await db.select().from(restaurants);
    const allAds = await db.select().from(advertisements);

    const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const activeRestaurants = allRestaurants.filter((r) => r.status === 'active').length;
    const activeUsers = allUsers.filter((u) => u.isActive).length;

    res.json({
      totalRestaurants: allRestaurants.length,
      activeRestaurants,
      totalUsers: allUsers.length,
      activeUsers,
      totalGamePoints: 0,
      totalAdRevenue: 0,
      totalAdImpressions: 0,
      activeCampaigns: allAds.filter((a) => a.isActive).length,
      totalCampaigns: allAds.length,
      totalOrders: allOrders.length,
      totalViews: 0,
      avgPointsPerUser: 0,
      monthlyData: [],
    });
  } catch (error) {
    next(error);
  }
});

export default router;
