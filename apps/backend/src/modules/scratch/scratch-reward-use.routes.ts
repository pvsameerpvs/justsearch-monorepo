import { Router } from 'express';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware } from '../../middleware/auth.middleware';
import { t, mapRow } from '../../lib/tenant-sql';

const router = Router({ mergeParams: true });
router.use(authMiddleware);

// POST /api/v1/scratch-rewards/use — mark a claimed reward as used
router.post('/use', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });
    if (!req.auth?.id) return res.status(401).json({ error: 'Authentication required' });

    const schema = z.object({
      trigger: z.enum(['welcome', 'order', 'auto_voucher']),
    });

    const body = schema.parse(req.body);
    const schemaName = req.tenant.schemaName;
    const customerId = req.auth.id;
    const restaurantId = req.tenant.id;

    const updatedRows = await db.execute<Record<string, unknown>>(sql`
      UPDATE ${t(schemaName, 'customer_scratch_rewards')}
      SET is_used = true, used_at = NOW()
      WHERE restaurant_id = ${restaurantId} AND customer_id = ${customerId} AND trigger = ${body.trigger} AND is_used = false
      RETURNING *
    `);

    if (!updatedRows[0]) return res.status(404).json({ error: 'No unused reward found' });
    res.json({ reward: mapRow(updatedRows[0]) });
  } catch (error) {
    next(error);
  }
});

export default router;
