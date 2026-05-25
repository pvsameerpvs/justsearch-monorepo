import { Router } from 'express';
import { z } from 'zod';
import { eq, and, sql, SQL } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { t, mapRow, mapRows } from '../../lib/tenant-sql';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/menu-categories — list categories for current tenant
router.get('/', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schemaName = req.tenant.schemaName;

    const categories = mapRows(await db.execute<Record<string, unknown>>(sql`
      SELECT * FROM ${t(schemaName, 'menu_categories')}
      WHERE restaurant_id = ${req.tenant.id}
      ORDER BY sort_order
    `));

    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/menu-categories — create category
router.post('/', requireRole('owner', 'manager', 'super_admin'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schema = z.object({
      name: z.string().min(2),
      description: z.string().max(500).optional(),
      emoji: z.string().max(10).optional(),
      sortOrder: z.number().int().nonnegative().optional(),
    });

    const body = schema.parse(req.body);
    const schemaName = req.tenant.schemaName;

    const categoryRows = await db.execute<Record<string, unknown>>(sql`
      INSERT INTO ${t(schemaName, 'menu_categories')} (
        restaurant_id, name, description, emoji, sort_order, status
      ) VALUES (
        ${req.tenant.id}, ${body.name}, ${body.description || null}, ${body.emoji || null},
        ${body.sortOrder ?? 0}, 'active'
      ) RETURNING *
    `);
    const category = mapRow(categoryRows[0]);

    res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/menu-categories/:id
router.patch('/:id', requireRole('owner', 'manager', 'super_admin'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schema = z.object({
      name: z.string().min(2).optional(),
      description: z.string().max(500).optional(),
      emoji: z.string().max(10).optional().or(z.literal('')),
      sortOrder: z.number().int().nonnegative().optional(),
      status: z.enum(['active', 'inactive']).optional(),
    });

    const body = schema.parse(req.body);
    const categoryId = req.params.id;
    const schemaName = req.tenant.schemaName;

    const sets: SQL[] = [];
    if (body.name !== undefined) sets.push(sql`name = ${body.name}`);
    if (body.description !== undefined) sets.push(sql`description = ${body.description}`);
    if (body.emoji !== undefined) sets.push(sql`emoji = ${body.emoji || null}`);
    if (body.sortOrder !== undefined) sets.push(sql`sort_order = ${body.sortOrder}`);
    if (body.status !== undefined) sets.push(sql`status = ${body.status}`);

    const updatedRows = await db.execute<Record<string, unknown>>(sql`
      UPDATE ${t(schemaName, 'menu_categories')}
      SET ${sql.join(sets, sql`, `)}
      WHERE id = ${categoryId} AND restaurant_id = ${req.tenant.id}
      RETURNING *
    `);

    if (!updatedRows[0]) return res.status(404).json({ error: 'Category not found' });
    const updated = mapRow(updatedRows[0]);

    res.json({ category: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/menu-categories/:id
router.delete('/:id', requireRole('owner', 'manager', 'super_admin'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const categoryId = req.params.id;
    const schemaName = req.tenant.schemaName;
    await db.execute(sql`
      DELETE FROM ${t(schemaName, 'menu_categories')}
      WHERE id = ${categoryId} AND restaurant_id = ${req.tenant.id}
    `);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
