import { Router } from 'express';
import { eq, desc } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { createRestaurantSchema, buildSettings } from './restaurant-create.utils';

const router = Router();
router.use(authMiddleware);

// POST /api/v1/restaurants — create new restaurant (super-admin only)
router.post('/', requireRole('super_admin'), async (req, res, next) => {
  try {
    const body = createRestaurantSchema.parse(req.body);
    const schemaName = `rest_${body.slug.replace(/-/g, '_')}`;

    const [restaurant] = await db
      .insert(restaurants)
      .values({
        slug: body.slug,
        subdomain: body.subdomain,
        schemaName,
        name: body.name,
        status: 'draft',
        settings: buildSettings(body),
        theme: {},
      })
      .returning();

    res.status(201).json({ restaurant });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/restaurants — list all (super-admin only)
router.get('/', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const allRestaurants = await db.select().from(restaurants).orderBy(desc(restaurants.createdAt));
    const flattened = allRestaurants.map((r) => ({
      ...r,
      ...(typeof r.settings === 'object' && r.settings !== null
        ? (r.settings as Record<string, unknown>)
        : {}),
    }));
    res.json({ restaurants: flattened });
  } catch (error) {
    next(error);
  }
});

export default router;
