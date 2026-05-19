import { Router } from 'express';
import { sql, desc, gte, lte, and, eq } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants, advertisements, adBillingEvents } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

// Safely parse JSONB array
function safeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string') {
    try { return JSON.parse(value) as string[]; } catch { return []; }
  }
  return [];
}

// Build last 6 months labels
function getMonthLabels(): string[] {
  const labels: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toLocaleString('en-US', { month: 'short' }));
  }
  return labels;
}

// Get start and end of a month offset from current
function getMonthRange(monthsAgo: number): { start: Date; end: Date } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() - monthsAgo;
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59);
  return { start, end };
}

router.get('/', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const allRestaurants = await db.select().from(restaurants).orderBy(desc(restaurants.createdAt));
    const activeSchemas = allRestaurants.filter((r) => r.status === 'active');

    // ── 1. Order revenue: loop tenant schemas ──
    let totalOrderRevenue = 0;
    let totalOrders = 0;
    const revenueMap = new Map<string, { revenue: number; orders: number }>();

    for (const schema of activeSchemas) {
      const orderRows = await db.execute(
        sql`SELECT COUNT(*) as count, COALESCE(SUM(CAST(total AS DECIMAL)), 0) as revenue FROM ${sql.identifier(schema.schemaName)}."orders"`
      );
      const data = orderRows[0] as { count: number; revenue: number } | undefined;
      if (data) {
        const orderCount = Number(data.count);
        const revenue = Number(data.revenue);
        totalOrders += orderCount;
        totalOrderRevenue += revenue;
        revenueMap.set(schema.id, { revenue, orders: orderCount });
      }
    }

    // ── 2. Ad revenue: from public.advertisements ──
    const allAds = await db.select().from(advertisements);

    let totalAdRevenue = 0;
    let totalAdViews = 0;
    const adRevenueByRestaurant = new Map<string, { adRevenue: number; adViews: number }>();

    for (const ad of allAds) {
      const targets = safeStringArray(ad.targetRestaurants);
      const adTotalRevenue = Number(ad.revenueJustsearch ?? 0) + Number(ad.revenueRestaurant ?? 0);
      totalAdRevenue += adTotalRevenue;
      totalAdViews += Number(ad.totalViews3s ?? 0) + Number(ad.totalViewsFull ?? 0);

      for (const restaurantId of targets) {
        const existing = adRevenueByRestaurant.get(restaurantId) || { adRevenue: 0, adViews: 0 };
        // Restaurant's share of revenue (40% for restaurant_brought, 0% for platform)
        const restaurantShare = Number(ad.revenueRestaurant ?? 0);
        existing.adRevenue += restaurantShare;
        // Views: if ad targets multiple restaurants, divide views fairly among them
        // so each restaurant gets proportional credit (avoids inflated per-restaurant stats)
        const totalViews = Number(ad.totalViews3s ?? 0) + Number(ad.totalViewsFull ?? 0);
        existing.adViews += targets.length > 0 ? Math.round(totalViews / targets.length) : totalViews;
        adRevenueByRestaurant.set(restaurantId, existing);
      }
    }

    // ── 3. Build restaurant list ──
    const restaurantList = allRestaurants.map((r) => {
      const stats = revenueMap.get(r.id) || { revenue: 0, orders: 0 };
      const adStats = adRevenueByRestaurant.get(r.id) || { adRevenue: 0, adViews: 0 };
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
        views: adStats.adViews,
        adRevenue: Math.round(adStats.adRevenue),
        subscriptionRevenue: 0, // Future: when subscriptions implemented
        platformFee: Math.round(stats.revenue * 0.05), // 5% platform fee on orders
      };
    });

    const activeRestaurants = activeSchemas.length;
    const totalRevenue = totalOrderRevenue + totalAdRevenue;
    const avgRevenue = allRestaurants.length > 0 ? Math.round(totalRevenue / allRestaurants.length) : 0;

    res.json({
      totalRevenue: Math.round(totalRevenue),
      adRevenue: Math.round(totalAdRevenue),
      subscriptionRevenue: 0,
      activeRestaurants,
      totalOrders,
      totalViews: totalAdViews,
      avgRevenuePerRestaurant: avgRevenue,
      growthPercent: 0, // Future: compare to previous period
      restaurants: restaurantList,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/revenue/trend — last 6 months revenue breakdown (super-admin only)
router.get('/trend', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const months = getMonthLabels();
    const trend: number[] = [];

    for (let i = 5; i >= 0; i--) {
      const { start, end } = getMonthRange(i);

      // ── 1. Ad revenue from billing events ──
      const billingRows = await db
        .select()
        .from(adBillingEvents)
        .where(
          and(
            gte(adBillingEvents.createdAt, start),
            lte(adBillingEvents.createdAt, end),
            eq(adBillingEvents.isConfirmed, true)
          )
        );
      const adRevenue = billingRows.reduce((sum, row) => sum + Number(row.amount), 0);

      // ── 2. Order revenue: loop tenant schemas ──
      let orderRevenue = 0;
      const allRestaurants = await db.select().from(restaurants);
      const activeSchemas = allRestaurants.filter((r) => r.status === 'active');

      for (const schema of activeSchemas) {
        const rows = await db.execute(
          sql`SELECT COALESCE(SUM(CAST(total AS DECIMAL)), 0) as revenue
              FROM ${sql.identifier(schema.schemaName)}."orders"
              WHERE created_at >= ${start.toISOString()}::timestamptz
                AND created_at <= ${end.toISOString()}::timestamptz
                AND status = 'completed'`
        );
        orderRevenue += Number((rows[0] as { revenue: number } | undefined)?.revenue ?? 0);
      }

      trend.push(Math.round(adRevenue + orderRevenue));
    }

    res.json({ months, trend });
  } catch (error) {
    next(error);
  }
});

export default router;
