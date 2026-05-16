import { Router } from 'express';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import { menuCategories } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/menu-categories — list categories for current tenant
router.get('/', async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const categories = await db
      .select()
      .from(menuCategories)
      .where(eq(menuCategories.restaurantId, req.tenant.id))
      .orderBy(menuCategories.sortOrder);

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
      sortOrder: z.number().int().nonnegative().optional(),
    });

    const body = schema.parse(req.body);

    const [category] = await db
      .insert(menuCategories)
      .values({
        restaurantId: req.tenant.id,
        name: body.name,
        description: body.description,
        sortOrder: body.sortOrder ?? 0,
        status: 'active',
      })
      .returning();

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
      sortOrder: z.number().int().nonnegative().optional(),
      status: z.enum(['active', 'inactive']).optional(),
    });

    const body = schema.parse(req.body);
    const categoryId = req.params.id;

    const [updated] = await db
      .update(menuCategories)
      .set({ ...body })
      .where(and(eq(menuCategories.id, categoryId), eq(menuCategories.restaurantId, req.tenant.id)))
      .returning();

    if (!updated) return res.status(404).json({ error: 'Category not found' });

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
    await db
      .delete(menuCategories)
      .where(and(eq(menuCategories.id, categoryId), eq(menuCategories.restaurantId, req.tenant.id)));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
