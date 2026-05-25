import { Router } from 'express';
import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { t, mapRow, mapRows } from '../../lib/tenant-sql';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/orders — list orders for this restaurant (with optional driverId filter)
router.get('/', requireRole('owner', 'manager', 'cashier', 'kitchen_staff', 'driver'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });

    const driverId = req.query.driverId as string | undefined;
    const schemaName = req.tenant.schemaName;

    let orderQuery = sql`SELECT * FROM ${t(schemaName, 'orders')} WHERE restaurant_id = ${req.tenant.id}`;
    if (driverId) {
      orderQuery = sql`SELECT * FROM ${t(schemaName, 'orders')} WHERE restaurant_id = ${req.tenant.id} AND driver_id = ${driverId}`;
    }

    const orderList = mapRows(await db.execute<Record<string, unknown>>(sql`${orderQuery} ORDER BY created_at DESC LIMIT 100`));

    const orderIds = orderList.map((o) => String(o.id));
    let itemsCountMap: Record<string, number> = {};

    if (orderIds.length > 0) {
      const orderIdList = orderIds.map((id) => sql`${id}`);
      const counts = await db.execute<Record<string, unknown>>(sql`
        SELECT order_id, COUNT(*)::int AS count
        FROM ${t(schemaName, 'order_items')}
        WHERE order_id IN (${sql.join(orderIdList, sql`, `)})
        GROUP BY order_id
      `);

      for (const c of counts) {
        itemsCountMap[String(c.order_id)] = Number(c.count);
      }
    }

    const enriched = orderList.map((o) => ({
      ...o,
      items: itemsCountMap[String(o.id)] || 0,
    }));

    res.json({ orders: enriched });
  } catch (error) {
    next(error);
  }
});

export default router;
