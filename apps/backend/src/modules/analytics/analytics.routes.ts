import { Router } from 'express';
import { eq, and, sql, gte, lte } from 'drizzle-orm';
import { db } from '../../db';
import { orders, orderItems, userRestaurants, advertisements } from '../../db/schema';
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

// GET /api/v1/analytics/summary — restaurant summary stats
router.get('/summary', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // ── Order stats ──
    const todayOrders = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, req.tenant.id),
          gte(orders.createdAt, startOfDay),
          lte(orders.createdAt, endOfDay)
        )
      );

    const totalOrders = todayOrders.length;
    const completedOrders = todayOrders.filter((o) => o.status === 'completed');
    const orderRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const avgOrderValue = completedOrders.length > 0 ? orderRevenue / completedOrders.length : 0;

    const customerCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(userRestaurants)
      .where(eq(userRestaurants.restaurantId, req.tenant.id));

    // ── Ad revenue for this restaurant ──
    const allAds = await db.select().from(advertisements);
    let adRevenue = 0;
    let adViews = 0;

    for (const ad of allAds) {
      const targets = safeStringArray(ad.targetRestaurants);
      if (targets.length === 0 || targets.includes(req.tenant.id)) {
        adRevenue += Number(ad.revenueRestaurant ?? 0);
        adViews += Number(ad.totalViews3s ?? 0) + Number(ad.totalViewsFull ?? 0);
      }
    }

    res.json({
      today: {
        orders: totalOrders,
        completed: completedOrders.length,
        revenue: orderRevenue,
        avgOrderValue: Number(avgOrderValue.toFixed(2)),
      },
      adRevenue: Math.round(adRevenue),
      adViews,
      totalCustomers: customerCount[0]?.count ?? 0,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/analytics/orders — order trends
router.get('/orders', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const days = typeof req.query.days === 'string' ? parseInt(req.query.days, 10) : 7;
    const allOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.restaurantId, req.tenant.id));

    const trend = Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
      const dayOrders = allOrders.filter((o) => {
        const created = new Date(o.createdAt);
        return created >= dayStart && created <= dayEnd;
      });
      return {
        date: d.toISOString().split('T')[0],
        orders: dayOrders.length,
        revenue: dayOrders
          .filter((o) => o.status === 'completed')
          .reduce((sum, o) => sum + Number(o.total), 0),
      };
    });

    res.json({ trend });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/analytics/top-items — best selling items
router.get('/top-items', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.restaurantId, req.tenant.id));

    const counts: Record<string, { name: string; quantity: number; revenue: number }> = {};
    for (const item of items) {
      if (!counts[item.name]) {
        counts[item.name] = { name: item.name, quantity: 0, revenue: 0 };
      }
      counts[item.name].quantity += item.quantity;
      counts[item.name].revenue += item.quantity * Number(item.price);
    }

    const topItems = Object.values(counts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    res.json({ topItems });
  } catch (error) {
    next(error);
  }
});

export default router;
