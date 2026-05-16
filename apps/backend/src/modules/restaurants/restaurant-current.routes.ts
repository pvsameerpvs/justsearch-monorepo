import { Router } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

// GET /api/v1/restaurants/current — resolve by subdomain
router.get('/current', async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const [restaurant] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, req.tenant.id))
      .limit(1);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({
      id: restaurant.id,
      slug: restaurant.slug,
      subdomain: restaurant.subdomain,
      name: restaurant.name,
      status: restaurant.status,
      theme: restaurant.theme,
      settings: restaurant.settings,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/restaurants/current — update current tenant restaurant
router.patch('/current', authMiddleware, requireRole('owner', 'manager'), async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const body = req.body as Record<string, unknown>;

    const [existing] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, req.tenant.id))
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const currentSettings = (typeof existing.settings === 'object' && existing.settings !== null)
      ? (existing.settings as Record<string, unknown>)
      : {};

    const mergedSettings = { ...currentSettings, ...body };

    const [updated] = await db
      .update(restaurants)
      .set({
        settings: mergedSettings,
        updatedAt: new Date(),
      })
      .where(and(eq(restaurants.id, req.tenant.id)))
      .returning();

    res.json({
      id: updated.id,
      slug: updated.slug,
      subdomain: updated.subdomain,
      name: updated.name,
      status: updated.status,
      theme: updated.theme,
      settings: updated.settings,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
