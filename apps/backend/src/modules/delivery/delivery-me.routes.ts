import { Router } from 'express';
import { z } from 'zod';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { t, mapRow } from '../../lib/tenant-sql';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('driver'));

const AGENT_SELECT_SQL = sql`
  id, name, phone, vehicle_type, status, rating, completed_today, shift_label, is_active, created_at, updated_at
`;

// GET /api/v1/delivery-agents/me — current driver's profile
router.get('/', async (req, res, next) => {
  try {
    if (!req.tenant || !req.auth) {
      return res.status(400).json({ error: 'Authentication context required' });
    }
    const schemaName = req.tenant.schemaName;

    const rows = await db.execute<Record<string, unknown>>(sql`
      SELECT ${AGENT_SELECT_SQL} FROM ${t(schemaName, 'delivery_agents')}
      WHERE id = ${req.auth.id} AND restaurant_id = ${req.tenant.id}
      LIMIT 1
    `);

    const agent = rows[0] ? mapRow(rows[0]) : undefined;
    if (!agent) return res.status(404).json({ error: 'Delivery agent not found' });

    res.json({ agent });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/delivery-agents/me/status — toggle online/offline/busy
router.patch('/status', async (req, res, next) => {
  try {
    if (!req.tenant || !req.auth) {
      return res.status(400).json({ error: 'Authentication context required' });
    }
    const schemaName = req.tenant.schemaName;

    const schema = z.object({
      status: z.enum(['online', 'busy', 'offline']),
    });

    const { status } = schema.parse(req.body);

    const rows = await db.execute<Record<string, unknown>>(sql`
      UPDATE ${t(schemaName, 'delivery_agents')}
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${req.auth.id} AND restaurant_id = ${req.tenant.id}
      RETURNING ${AGENT_SELECT_SQL}
    `);

    const updated = rows[0] ? mapRow(rows[0]) : undefined;
    if (!updated) return res.status(404).json({ error: 'Delivery agent not found' });

    res.json({ agent: updated });
  } catch (error) {
    next(error);
  }
});

// GPS location tracking not implemented in current schema
// PATCH /api/v1/delivery-agents/me/location placeholder removed

export default router;
