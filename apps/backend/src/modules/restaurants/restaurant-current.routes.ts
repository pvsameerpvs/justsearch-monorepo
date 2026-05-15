import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants } from '../../db/schema';

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

export default router;
