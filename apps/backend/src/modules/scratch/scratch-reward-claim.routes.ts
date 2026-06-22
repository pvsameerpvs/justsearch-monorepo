import { Router } from 'express';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware } from '../../middleware/auth.middleware';
import { t, mapRow, mapRows } from '../../lib/tenant-sql';

const router = Router();
router.use(authMiddleware);

router.post('/claim', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });
    if (!req.auth?.id) return res.status(401).json({ error: 'Authentication required' });

    const schema = z.object({
      trigger: z.enum(['welcome', 'order']),
      voucherCode: z.string().min(3).max(50),
    });

    const body = schema.parse(req.body);
    const schemaName = req.tenant.schemaName;
    const customerId = req.auth.id;
    const restaurantId = req.tenant.id;

    const existing = mapRows(await db.execute<Record<string, unknown>>(sql`
      SELECT * FROM ${t(schemaName, 'customer_scratch_rewards')}
      WHERE restaurant_id = ${restaurantId} AND customer_id = ${customerId} AND trigger = ${body.trigger}
      LIMIT 1
    `));

    if (existing[0]) {
      return res.status(409).json({ error: 'Reward already claimed', reward: existing[0] });
    }

    const voucherRows = mapRows(await db.execute<Record<string, unknown>>(sql`
      SELECT * FROM ${t(schemaName, 'promo_codes')}
      WHERE restaurant_id = ${restaurantId} AND code = ${body.voucherCode.toUpperCase()}
      LIMIT 1
    `));
    const voucher = voucherRows[0];
    const expiryAt = voucher?.validUntil ? new Date(String(voucher.validUntil)).toISOString() : null;

    const insertedRows = await db.execute<Record<string, unknown>>(sql`
      INSERT INTO ${t(schemaName, 'customer_scratch_rewards')}
      (restaurant_id, customer_id, trigger, voucher_code, claimed_at, expiry_at, is_used)
      VALUES (${restaurantId}, ${customerId}, ${body.trigger}, ${body.voucherCode.toUpperCase()}, NOW(), ${expiryAt}, false)
      RETURNING *
    `);

    const reward = mapRow(insertedRows[0]);
    res.status(201).json({ reward });
  } catch (error) {
    next(error);
  }
});

export default router;
