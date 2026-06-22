import { Router } from 'express';
import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware } from '../../middleware/auth.middleware';
import { t, mapRows } from '../../lib/tenant-sql';

const router = Router();
router.use(authMiddleware);

// GET /api/v1/scratch-campaigns
router.get('/', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });
    const schemaName = req.tenant.schemaName;

    const list = mapRows(await db.execute<Record<string, unknown>>(sql`
      SELECT
        sc.*,
        pc.type AS voucher_type,
        pc.value AS voucher_value
      FROM ${t(schemaName, 'scratch_campaigns')} sc
      LEFT JOIN ${t(schemaName, 'promo_codes')} pc
        ON pc.restaurant_id = sc.restaurant_id AND pc.code = sc.voucher_code
      WHERE sc.restaurant_id = ${req.tenant.id}
      ORDER BY sc.trigger ASC
    `));

    res.json({ campaigns: list });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/scratch-campaigns/:trigger
router.get('/:trigger', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });
    const schemaName = req.tenant.schemaName;
    const trigger = req.params.trigger;

    const rows = mapRows(await db.execute<Record<string, unknown>>(sql`
      SELECT * FROM ${t(schemaName, 'scratch_campaigns')}
      WHERE restaurant_id = ${req.tenant.id} AND trigger = ${trigger}
      LIMIT 1
    `));

    if (!rows[0]) return res.status(404).json({ error: 'Campaign not found' });
    res.json({ campaign: rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
