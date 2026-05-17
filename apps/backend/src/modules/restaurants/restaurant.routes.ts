import { Router } from 'express';
import { desc } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { createRestaurantSchema, buildSettings } from './restaurant-create.utils';
import { createTenantSchema, setupTenantDefaults } from '../../db/tenant-template';

const router = Router();

router.post('/', authMiddleware, requireRole('super_admin'), async (req, res, next) => {
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

    await createTenantSchema(schemaName);
    await setupTenantDefaults(schemaName, restaurant.id, {
      username: body.dashboardUsername,
      password: body.dashboardPassword,
    });

    res.status(201).json({ restaurant });
  } catch (error) {
    next(error);
  }
});

router.get('/', authMiddleware, requireRole('super_admin'), async (_req, res, next) => {
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
