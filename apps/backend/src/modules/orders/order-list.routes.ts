import { Router } from 'express';
import { sql } from 'drizzle-orm';
import { db, client } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/orders — list orders (with optional driverId filter)
router.get('/', requireRole('owner', 'manager', 'cashier', 'kitchen_staff', 'driver'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });

    const driverId = req.query.driverId as string | undefined;
    const schemaName = req.tenant.schemaName;

    const conditions = [`restaurant_id = $1`];
    const params: any[] = [req.tenant.id];

    if (driverId) {
      conditions.push(`driver_id = $${params.length + 1}`);
      params.push(driverId);
    }

    const rawQuery = `SELECT * FROM "${schemaName}"."orders" WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC LIMIT 100`;
    const orderList = await client.unsafe(rawQuery, params) as Record<string, unknown>[];

    const orderIds = orderList.map((o) => o.id as string);
    let itemsCountMap: Record<string, number> = {};

    if (orderIds.length > 0) {
      const placeholders = orderIds.map((_, i) => `$${i + 1}`).join(',');
      const countQuery = `SELECT order_id, COUNT(*)::int as count FROM "${schemaName}"."order_items" WHERE order_id IN (${placeholders}) GROUP BY order_id`;
      const counts = await client.unsafe(countQuery, orderIds) as Record<string, unknown>[];
      for (const c of counts) {
        itemsCountMap[c.order_id as string] = c.count as number;
      }
    }

    const enriched = orderList.map((o) => ({
      ...o,
      items: itemsCountMap[o.id as string] || 0,
    }));

    res.json({ orders: enriched });
  } catch (error) {
    next(error);
  }
});

export default router;
