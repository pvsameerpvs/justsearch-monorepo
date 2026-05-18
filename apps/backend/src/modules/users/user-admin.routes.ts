import { Router } from 'express';
import { sql, eq } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants, users, userRestaurants } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const schemas = await db
      .select({ schemaName: restaurants.schemaName, id: restaurants.id, name: restaurants.name })
      .from(restaurants)
      .where(eq(restaurants.status, 'active'));

    const allUsers: Array<Record<string, unknown>> = [];
    for (const schema of schemas) {
      const links = await db
        .select()
        .from(userRestaurants)
        .where(eq(userRestaurants.restaurantId, schema.id));

      for (const link of links) {
        const [user] = await db
          .select({
            id: users.id,
            email: users.email,
            phone: users.phone,
            name: users.name,
            role: users.role,
            isActive: users.isActive,
            createdAt: users.createdAt,
          })
          .from(users)
          .where(eq(users.id, link.userId))
          .limit(1);

        if (user) {
          allUsers.push({
            ...user,
            restaurantId: schema.id,
            restaurantName: schema.name,
            restaurantRole: link.role,
          });
        }
      }
    }

    res.json({ users: allUsers });
  } catch (error) {
    next(error);
  }
});

router.get('/:restaurantId', requireRole('super_admin'), async (req, res, next) => {
  try {
    const [restaurant] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, req.params.restaurantId))
      .limit(1);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const links = await db
      .select()
      .from(userRestaurants)
      .where(eq(userRestaurants.restaurantId, restaurant.id));

    const rows = [];
    for (const link of links) {
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          phone: users.phone,
          name: users.name,
          role: users.role,
          isActive: users.isActive,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, link.userId))
        .limit(1);

      if (user) {
        rows.push({ ...user, restaurantRole: link.role });
      }
    }

    res.json({ users: rows, restaurant: { id: restaurant.id, name: restaurant.name } });
  } catch (error) {
    next(error);
  }
});

export default router;
