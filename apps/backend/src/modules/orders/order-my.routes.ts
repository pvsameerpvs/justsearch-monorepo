import { Router } from 'express';
import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants } from '../../db/schema';
import { authMiddleware } from '../../middleware/auth.middleware';
import { t, mapRow, mapRows } from '../../lib/tenant-sql';

const router = Router();
router.use(authMiddleware);

// GET /api/v1/orders/my — list ALL orders for the authenticated customer (tenant-scoped)
router.get('/', async (req, res, next) => {
  try {
    if (!req.auth?.id) return res.status(401).json({ error: 'Authentication required' });

    const customerId = req.auth.id;
    const schemaName = req.tenant!.schemaName;

    const rows = await db.execute<Record<string, unknown>>(sql`
      SELECT o.*, r.name AS restaurant_name
      FROM ${t(schemaName, 'orders')} o
      LEFT JOIN ${t('public', 'restaurants')} r ON o.restaurant_id = r.id
      WHERE o.customer_id = ${customerId}
      ORDER BY o.created_at DESC
      LIMIT 100
    `);

    const orderIds = rows.map((r) => String(r.id));
    let allItems: Record<string, unknown>[] = [];

    if (orderIds.length > 0) {
      const orderIdList = orderIds.map((id) => sql`${id}`);
      allItems = await db.execute<Record<string, unknown>>(sql`
        SELECT * FROM ${t(schemaName, 'order_items')}
        WHERE order_id IN (${sql.join(orderIdList, sql`, `)})
      `);
    }

    const enriched = rows.map((row) => ({
      order: { ...mapRow(row), restaurantName: row.restaurant_name },
      items: allItems.filter((item) => String(item.order_id) === String(row.id)).map(mapRow),
    }));

    res.json({ orders: enriched });
  } catch (error) {
    next(error);
  }
});

export default router;
