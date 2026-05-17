import { Router } from 'express';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { db, client } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { hashPassword } from '../../lib/hash';

const router = Router();

router.use(authMiddleware);

function stripPassword(agent: Record<string, unknown>) {
  const { passwordHash, password_hash, ...rest } = agent;
  return rest;
}

// GET /api/v1/delivery-agents — list agents for current tenant
router.get('/', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });

    const schemaName = req.tenant.schemaName;
    const list = await db.execute<Record<string, unknown>>(
      sql`SELECT * FROM ${sql.identifier(schemaName)}.${sql.identifier('delivery_agents')} WHERE restaurant_id = ${req.tenant.id} ORDER BY created_at DESC`
    );

    res.json({ agents: list.map(stripPassword) });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/delivery-agents — create new agent
router.post('/', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });

    const schema = z.object({
      name: z.string().min(2),
      phone: z.string().min(5),
      username: z.string().min(3),
      password: z.string().min(6),
      vehicleType: z.enum(['bike', 'scooter', 'car']).default('scooter'),
    });

    const body = schema.parse(req.body);
    const passwordHash = await hashPassword(body.password);
    const schemaName = req.tenant.schemaName;

    const [agent] = await db.execute<Record<string, unknown>>(
      sql`INSERT INTO ${sql.identifier(schemaName)}.${sql.identifier('delivery_agents')}
        (restaurant_id, name, phone, username, password_hash, vehicle_type, status, rating, completed_today, is_active, created_at, updated_at)
        VALUES (${req.tenant.id}, ${body.name}, ${body.phone}, ${body.username}, ${passwordHash}, ${body.vehicleType}, 'offline', '5.0', 0, true, NOW(), NOW())
        RETURNING *`
    );

    res.status(201).json({ agent: stripPassword(agent) });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/delivery-agents/:id — update agent
router.patch('/:id', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });

    const schema = z.object({
      name: z.string().min(2).optional(),
      phone: z.string().min(5).optional(),
      vehicleType: z.enum(['bike', 'scooter', 'car']).optional(),
      password: z.string().min(6).optional(),
      isActive: z.boolean().optional(),
      status: z.enum(['online', 'busy', 'offline']).optional(),
    });

    const body = schema.parse(req.body);
    const agentId = req.params.id;
    const schemaName = req.tenant.schemaName;

    const setFields: string[] = ['updated_at = NOW()'];
    const params: any[] = [];
    let paramIndex = 0;

    if (body.name !== undefined) { setFields.push(`name = $${++paramIndex}`); params.push(body.name); }
    if (body.phone !== undefined) { setFields.push(`phone = $${++paramIndex}`); params.push(body.phone); }
    if (body.vehicleType !== undefined) { setFields.push(`vehicle_type = $${++paramIndex}`); params.push(body.vehicleType); }
    if (body.password) { setFields.push(`password_hash = $${++paramIndex}`); params.push(await hashPassword(body.password)); }
    if (body.isActive !== undefined) { setFields.push(`is_active = $${++paramIndex}`); params.push(body.isActive); }
    if (body.status !== undefined) { setFields.push(`status = $${++paramIndex}`); params.push(body.status); }

    if (setFields.length === 1) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    params.push(agentId, req.tenant.id);

    const rawQuery = `UPDATE "${schemaName}"."delivery_agents" SET ${setFields.join(', ')} WHERE id = $${paramIndex + 1} AND restaurant_id = $${paramIndex + 2} RETURNING *`;
    const [updated] = await client.unsafe(rawQuery, params) as Record<string, unknown>[];

    if (!updated) return res.status(404).json({ message: 'Agent not found' });

    res.json({ agent: stripPassword(updated) });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/delivery-agents/:id
router.delete('/:id', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });

    const agentId = req.params.id;
    const schemaName = req.tenant.schemaName;

    // Check if driver has active (non-completed) delivery assignments
    const activeAssignments = await db.execute<{ count: number }>(
      sql`SELECT COUNT(*) as count FROM ${sql.identifier(schemaName)}.${sql.identifier('delivery_assignments')} WHERE agent_id = ${agentId} AND status NOT IN ('delivered', 'cancelled')`
    );

    const count = Number((activeAssignments[0] as unknown as Record<string, unknown>)?.count ?? 0);
    if (count > 0) {
      return res.status(409).json({
        message: `Cannot delete driver: they have ${count} active delivery assignment(s). Please reassign or complete all deliveries first.`,
      });
    }

    await db.execute(
      sql`DELETE FROM ${sql.identifier(schemaName)}.${sql.identifier('delivery_agents')} WHERE id = ${agentId} AND restaurant_id = ${req.tenant.id}`
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
