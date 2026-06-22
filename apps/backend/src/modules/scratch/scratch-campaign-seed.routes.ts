import { Router } from 'express';
import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { t, mapRows } from '../../lib/tenant-sql';

const router = Router({ mergeParams: true });
router.use(authMiddleware);

router.post('/seed', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });
    const schemaName = req.tenant.schemaName;
    const restaurantId = req.tenant.id;

    const existing = mapRows(await db.execute<Record<string, unknown>>(sql`
      SELECT trigger FROM ${t(schemaName, 'scratch_campaigns')}
      WHERE restaurant_id = ${restaurantId}
    `));
    const existingTriggers = new Set(existing.map((r) => r.trigger));

    const seeds: { trigger: string; code: string; title: string }[] = [];
    if (!existingTriggers.has('welcome')) seeds.push({ trigger: 'welcome', code: 'WELCOME15', title: 'Welcome Offer' });
    if (!existingTriggers.has('order')) seeds.push({ trigger: 'order', code: 'NEXT10', title: 'Next Order Offer' });

    for (const s of seeds) {
      await db.execute(sql`
        INSERT INTO ${t(schemaName, 'scratch_campaigns')} (restaurant_id, trigger, is_enabled, voucher_code, title)
        VALUES (${restaurantId}, ${s.trigger}, true, ${s.code}, ${s.title})
      `);
    }

    const all = mapRows(await db.execute<Record<string, unknown>>(sql`
      SELECT * FROM ${t(schemaName, 'scratch_campaigns')}
      WHERE restaurant_id = ${restaurantId}
      ORDER BY trigger ASC
    `));

    res.json({ campaigns: all, seeded: seeds.map((s) => s.trigger) });
  } catch (error) {
    next(error);
  }
});

export default router;
