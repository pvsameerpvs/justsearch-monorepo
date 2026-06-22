import { Router } from 'express';
import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware } from '../../middleware/auth.middleware';
import { t, mapRows } from '../../lib/tenant-sql';

const router = Router();
router.use(authMiddleware);

router.get('/my', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });
    if (!req.auth?.id) return res.status(401).json({ error: 'Authentication required' });

    const schemaName = req.tenant.schemaName;
    const customerId = req.auth.id;
    const restaurantId = req.tenant.id;

    const list = mapRows(await db.execute<Record<string, unknown>>(sql`
      SELECT * FROM ${t(schemaName, 'customer_scratch_rewards')}
      WHERE restaurant_id = ${restaurantId} AND customer_id = ${customerId}
      ORDER BY claimed_at DESC
    `));

    res.json({ rewards: list });
  } catch (error) {
    next(error);
  }
});

export default router;
