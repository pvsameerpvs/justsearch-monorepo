import { Router } from 'express';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import { menuItems, menuCategories, menus } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/menu-items — list items for current tenant
router.get('/', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const items = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.restaurantId, req.tenant.id))
      .orderBy(menuItems.sortOrder);

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

    let menuId = body.menuId;
    if (!menuId) {
      const [firstMenu] = await db
        .select({ id: menus.id })
        .from(menus)
        .where(eq(menus.restaurantId, req.tenant.id))
        .limit(1);
      if (!firstMenu) {
        return res.status(400).json({ error: 'No menu found for this restaurant. Create a menu first.' });
      }
      menuId = firstMenu.id;
    }

    const [item] = await db
      .insert(menuItems)
      .values({
        restaurantId: req.tenant.id,
        menuId,
        categoryId: body.categoryId,
        name: body.name,
        description: body.description,
        price: String(body.price),
        imageUrl: body.imageUrl,
        tags: body.tags ?? [],
        isVeg: body.isVeg ?? false,
        isAvailable: body.isAvailable ?? true,
        sortOrder: body.sortOrder ?? 0,
      })
      .returning();

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

    const updateData: Record<string, unknown> = {};
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = String(body.price);
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl || null;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.isVeg !== undefined) updateData.isVeg = body.isVeg;
    if (body.isAvailable !== undefined) updateData.isAvailable = body.isAvailable;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;

    const [updated] = await db
      .update(menuItems)
      .set(updateData)
      .where(and(eq(menuItems.id, itemId), eq(menuItems.restaurantId, req.tenant.id)))
      .returning();

    if (!updated) return res.status(404).json({ error: 'Item not found' });

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
    await db
      .delete(menuItems)
      .where(and(eq(menuItems.id, itemId), eq(menuItems.restaurantId, req.tenant.id)));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
