import { Router } from 'express';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { t, mapRow } from '../../lib/tenant-sql';

const router = Router();

router.use(authMiddleware);

// POST /api/v1/close-day — create daily closeout
router.post('/', requireRole('owner', 'manager', 'cashier'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) });
    const { date } = schema.parse(req.body);
    const schemaName = req.tenant.schemaName;

    const startOfDay = new Date(date + 'T00:00:00');
    const endOfDay = new Date(date + 'T23:59:59');

    const completedOrders = await db.execute<Record<string, unknown>>(sql`
      SELECT * FROM ${t(schemaName, 'orders')}
      WHERE restaurant_id = ${req.tenant.id}
        AND status = 'completed'
        AND created_at >= ${startOfDay}
        AND created_at <= ${endOfDay}
    `);

    const cashTotal = completedOrders
      .filter((o) => o.payment_method === 'cash')
      .reduce((sum, o) => sum + Number(o.total), 0);

    const cardTotal = completedOrders
      .filter((o) => o.payment_method === 'card')
      .reduce((sum, o) => sum + Number(o.total), 0);

    const orderCount = completedOrders.length;
    const grandTotal = cashTotal + cardTotal;

    const closeoutRows = await db.execute<Record<string, unknown>>(sql`
      INSERT INTO ${t(schemaName, 'daily_closeouts')} (
        restaurant_id, date, cash_total, card_total, order_count, grand_total, closed_by
      ) VALUES (
        ${req.tenant.id}, ${date}, ${String(cashTotal)}, ${String(cardTotal)},
        ${orderCount}, ${String(grandTotal)}, ${req.auth!.id}
      ) RETURNING *
    `);
    const closeout = mapRow(closeoutRows[0]);

    res.status(201).json({ closeout });
  } catch (error) {
    next(error);
  }
});

export default router;
