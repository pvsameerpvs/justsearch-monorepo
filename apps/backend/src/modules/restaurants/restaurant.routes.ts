import { Router } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// POST /api/v1/restaurants — create new restaurant (super-admin only)
router.post('/', requireRole('super_admin'), async (req, res, next) => {
  try {

    const schema = z.object({
      slug: z.string().min(3).max(64),
      subdomain: z.string().min(3).max(64),
      name: z.string().min(1).max(255),
    });

    const body = schema.parse(req.body);
    const schemaName = `rest_${body.slug.replace(/-/g, '_')}`;

    const [restaurant] = await db
      .insert(restaurants)
      .values({
        slug: body.slug,
        subdomain: body.subdomain,
        schemaName,
        name: body.name,
        status: 'draft',
        settings: {},
        theme: {},
      })
      .returning();

    res.status(201).json({ restaurant });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/restaurants — list all (super-admin only)
router.get('/', requireRole('super_admin'), async (req, res, next) => {
  try {
    const allRestaurants = await db.select().from(restaurants);
    res.json({ restaurants: allRestaurants });
  } catch (error) {
    next(error);
  }
});

export default router;
