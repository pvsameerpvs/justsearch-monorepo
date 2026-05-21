import { Router } from 'express';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { hashPassword } from '../../lib/hash';
import { checkCanModifyStaff, checkCanDeleteStaff, updateStaffMember } from './staff.services';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/staff — list staff for current tenant
router.get('/', requireRole('owner', 'manager', 'cashier', 'kitchen_staff'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });

    const schemaName = req.tenant.schemaName;
    const list = await db.execute<Record<string, unknown>>(
      sql`SELECT id, restaurant_id, name, username, role, permissions, is_active, created_at, updated_at FROM ${sql.identifier(schemaName)}.${sql.identifier('staff')} WHERE restaurant_id = ${req.tenant.id} ORDER BY created_at DESC`
    );

    res.json({ staff: list });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/staff — create new staff (owner/manager only)
router.post('/', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });

    const schema = z.object({
      name: z.string().min(2),
      username: z.string().min(3),
      password: z.string().min(6),
      role: z.enum(['owner', 'manager', 'cashier', 'kitchen_staff']),
    });

    const body = schema.parse(req.body);
    const passwordHash = await hashPassword(body.password);
    const schemaName = req.tenant.schemaName;

    const [member] = await db.execute<Record<string, unknown>>(
      sql`INSERT INTO ${sql.identifier(schemaName)}.${sql.identifier('staff')}
        (restaurant_id, name, username, password_hash, role, permissions, is_active, created_at, updated_at)
        VALUES (${req.tenant.id}, ${body.name}, ${body.username}, ${passwordHash}, ${body.role}, ${JSON.stringify({})}, true, NOW(), NOW())
        RETURNING id, restaurant_id, name, username, role, permissions, is_active, created_at, updated_at`
    );

    res.status(201).json({ staff: member });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/staff/:id — update staff (owner/manager only)
router.patch('/:id', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });

    const schema = z.object({
      name: z.string().min(2).optional(),
      username: z.string().min(3).optional(),
      password: z.string().min(6).optional(),
      role: z.enum(['owner', 'manager', 'cashier', 'kitchen_staff']).optional(),
      isActive: z.boolean().optional(),
    });

    const body = schema.parse(req.body);
    const staffId = req.params.id;
    const schemaName = req.tenant.schemaName;
    const userRole = req.auth?.role;

    const check = await checkCanModifyStaff(schemaName, staffId, req.tenant.id, userRole);
    if (!check.allowed) {
      return res.status(403).json({ message: check.message });
    }

    const updates: Record<string, string | boolean> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.username !== undefined) updates.username = body.username;
    if (body.password) updates.password_hash = await hashPassword(body.password);
    if (body.role !== undefined) updates.role = body.role;
    if (body.isActive !== undefined) updates.is_active = body.isActive;

    const updated = await updateStaffMember(schemaName, staffId, req.tenant.id, updates);
    if (!updated) return res.status(404).json({ message: 'Staff member not found' });

    res.json({ staff: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/staff/:id (owner/manager only)
router.delete('/:id', requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ message: 'Tenant context required' });

    const staffId = req.params.id;
    const schemaName = req.tenant.schemaName;

    const check = await checkCanDeleteStaff(schemaName, staffId, req.tenant.id, req.auth?.role, req.auth?.id);
    if (!check.allowed) {
      return res.status(403).json({ message: check.message });
    }

    await db.execute(
      sql`DELETE FROM ${sql.identifier(schemaName)}.${sql.identifier('staff')} WHERE id = ${staffId} AND restaurant_id = ${req.tenant.id}`
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
