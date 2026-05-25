import { Router } from 'express';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { t, mapRows } from '../../lib/tenant-sql';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/close-day — list closeouts
router.get('/', requireRole('owner', 'manager', 'cashier'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const date = req.query.date as string | undefined;
    const schemaName = req.tenant.schemaName;

    let rows: Record<string, unknown>[];
    if (date) {
      rows = await db.execute<Record<string, unknown>>(sql`
        SELECT * FROM ${t(schemaName, 'daily_closeouts')}
        WHERE restaurant_id = ${req.tenant.id} AND date = ${date}
        ORDER BY date DESC
        LIMIT 30
      `);
    } else {
      rows = await db.execute<Record<string, unknown>>(sql`
        SELECT * FROM ${t(schemaName, 'daily_closeouts')}
        WHERE restaurant_id = ${req.tenant.id}
        ORDER BY date DESC
        LIMIT 30
      `);
    }

    res.json({ closeouts: mapRows(rows) });
  } catch (error) {
    next(error);
  }
});

export default router;
