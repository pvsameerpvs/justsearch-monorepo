import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db';
import { restaurants, staff, deliveryAgents, superAdmins } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '../../lib/hash';
import { signToken } from '../../utils/jwt';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

// POST /api/v1/restaurants — create new restaurant (super-admin only)
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    if (req.auth?.type !== 'super_admin') {
      return res.status(403).json({ error: 'Super admin access required' });
    }

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
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    if (req.auth?.type !== 'super_admin') {
      return res.status(403).json({ error: 'Super admin access required' });
    }

    const allRestaurants = await db.select().from(restaurants);
    res.json({ restaurants: allRestaurants });
  } catch (error) {
    next(error);
  }
});

export default router;
