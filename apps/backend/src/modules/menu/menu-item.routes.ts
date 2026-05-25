import { Router } from 'express';
import { z } from 'zod';
import { eq, and, sql, SQL } from 'drizzle-orm';
import { db } from '../../db';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { t, mapRow, mapRows } from '../../lib/tenant-sql';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/menu-items — list items for current tenant
router.get('/', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schemaName = req.tenant.schemaName;

    const items = mapRows(await db.execute<Record<string, unknown>>(sql`
      SELECT * FROM ${t(schemaName, 'menu_items')}
      WHERE restaurant_id = ${req.tenant.id}
      ORDER BY sort_order
    `));

    res.json({ items });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/menu-items — create item
router.post('/', requireRole('owner', 'manager', 'super_admin'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schema = z.object({
      menuId: z.string().uuid().optional(),
      categoryId: z.string().uuid().optional(),
      name: z.string().min(2),
      description: z.string().max(500).optional(),
      price: z.number().positive(),
      imageUrl: z.string().url().optional(),
      tags: z.array(z.string()).max(3).optional(),
      isVeg: z.boolean().optional(),
      isAvailable: z.boolean().optional(),
      sortOrder: z.number().int().nonnegative().optional(),
    });

    const body = schema.parse(req.body);
    const schemaName = req.tenant.schemaName;

    let menuId = body.menuId;
    if (!menuId) {
      const menuRows = await db.execute<Record<string, unknown>>(sql`
        SELECT id FROM ${t(schemaName, 'menus')}
        WHERE restaurant_id = ${req.tenant.id}
        LIMIT 1
      `);
      if (!menuRows[0]) {
        return res.status(400).json({ error: 'No menu found for this restaurant. Create a menu first.' });
      }
      menuId = String(menuRows[0].id);
    }

    const itemRows = await db.execute<Record<string, unknown>>(sql`
      INSERT INTO ${t(schemaName, 'menu_items')} (
        restaurant_id, menu_id, category_id, name, description, price, image_url, tags, is_veg, is_available, sort_order
      ) VALUES (
        ${req.tenant.id}, ${menuId}, ${body.categoryId || null}, ${body.name}, ${body.description || null},
        ${String(body.price)}, ${body.imageUrl || null}, ${JSON.stringify(body.tags ?? [])}, ${body.isVeg ?? false},
        ${body.isAvailable ?? true}, ${body.sortOrder ?? 0}
      ) RETURNING *
    `);
    const item = mapRow(itemRows[0]);

    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/menu-items/:id — update item
router.patch('/:id', requireRole('owner', 'manager', 'super_admin'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const schema = z.object({
      categoryId: z.string().uuid().optional(),
      name: z.string().min(2).optional(),
      description: z.string().max(500).optional(),
      price: z.number().positive().optional(),
      imageUrl: z.string().url().optional().or(z.literal('')),
      tags: z.array(z.string()).max(3).optional(),
      isVeg: z.boolean().optional(),
      isAvailable: z.boolean().optional(),
      sortOrder: z.number().int().nonnegative().optional(),
    });

    const body = schema.parse(req.body);
    const itemId = req.params.id;
    const schemaName = req.tenant.schemaName;

    const sets: SQL[] = [];
    if (body.categoryId !== undefined) sets.push(sql`category_id = ${body.categoryId}`);
    if (body.name !== undefined) sets.push(sql`name = ${body.name}`);
    if (body.description !== undefined) sets.push(sql`description = ${body.description}`);
    if (body.price !== undefined) sets.push(sql`price = ${String(body.price)}`);
    if (body.imageUrl !== undefined) sets.push(sql`image_url = ${body.imageUrl || null}`);
    if (body.tags !== undefined) sets.push(sql`tags = ${JSON.stringify(body.tags)}`);
    if (body.isVeg !== undefined) sets.push(sql`is_veg = ${body.isVeg}`);
    if (body.isAvailable !== undefined) sets.push(sql`is_available = ${body.isAvailable}`);
    if (body.sortOrder !== undefined) sets.push(sql`sort_order = ${body.sortOrder}`);

    const updatedRows = await db.execute<Record<string, unknown>>(sql`
      UPDATE ${t(schemaName, 'menu_items')}
      SET ${sql.join(sets, sql`, `)}
      WHERE id = ${itemId} AND restaurant_id = ${req.tenant.id}
      RETURNING *
    `);

    if (!updatedRows[0]) return res.status(404).json({ error: 'Item not found' });
    const updated = mapRow(updatedRows[0]);

    res.json({ item: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/menu-items/:id
router.delete('/:id', requireRole('owner', 'manager', 'super_admin'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const itemId = req.params.id;
    const schemaName = req.tenant.schemaName;
    await db.execute(sql`
      DELETE FROM ${t(schemaName, 'menu_items')}
      WHERE id = ${itemId} AND restaurant_id = ${req.tenant.id}
    `);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
