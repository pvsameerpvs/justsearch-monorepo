import { Router } from 'express';
import { z } from 'zod';
import { sql, type SQL } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { t, mapRow } from '../../lib/tenant-sql';

const router = Router({ mergeParams: true });
router.use(authMiddleware);

router.patch('/:trigger', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schema = z.object({
      isEnabled: z.boolean().optional(),
      voucherCode: z.string().min(3).max(50).optional(),
      title: z.string().max(100).optional(),
      behavior: z.enum(['scratch_card', 'auto_add']).optional(),
      config: z.record(z.unknown()).optional(),
    });

    const body = schema.parse(req.body);
    const trigger = req.params.trigger;
    const schemaName = req.tenant.schemaName;

    const sets: SQL[] = [];
    if (body.isEnabled !== undefined) sets.push(sql`is_enabled = ${body.isEnabled}`);
    if (body.voucherCode !== undefined) sets.push(sql`voucher_code = ${body.voucherCode.toUpperCase()}`);
    if (body.title !== undefined) sets.push(sql`title = ${body.title}`);
    if (body.behavior !== undefined) sets.push(sql`behavior = ${body.behavior}`);
    if (body.config !== undefined) sets.push(sql`config = ${JSON.stringify(body.config)}`);
    sets.push(sql`updated_at = NOW()`);

    const updatedRows = await db.execute<Record<string, unknown>>(sql`
      UPDATE ${t(schemaName, 'scratch_campaigns')}
      SET ${sql.join(sets, sql`, `)}
      WHERE restaurant_id = ${req.tenant.id} AND trigger = ${trigger}
      RETURNING *
    `);

    if (!updatedRows[0]) return res.status(404).json({ error: 'Campaign not found' });
    res.json({ campaign: mapRow(updatedRows[0]) });
  } catch (error) {
    next(error);
  }
});

export default router;
