import { Router } from 'express';
import { eq, sql } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants, users, userRestaurants } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

// GET /api/v1/admin/users — all users across all restaurants
router.get('/', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const rows = await db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        restaurantId: userRestaurants.restaurantId,
        restaurantRole: userRestaurants.role,
      })
      .from(users)
      .innerJoin(userRestaurants, eq(users.id, userRestaurants.userId))
      .innerJoin(restaurants, eq(userRestaurants.restaurantId, restaurants.id));

    const enriched = rows.map((r) => ({
      id: r.userId,
      name: r.name,
      email: r.email,
      phone: r.phone,
      role: r.role,
      isActive: r.isActive,
      createdAt: r.createdAt,
      restaurantId: r.restaurantId,
      restaurantRole: r.restaurantRole,
    }));

    res.json({ users: enriched });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/users/:restaurantId — users for specific restaurant
router.get('/:restaurantId', requireRole('super_admin'), async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId;

    const [restaurant] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
      .limit(1);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        phone: users.phone,
        name: users.name,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        restaurantRole: userRestaurants.role,
      })
      .from(users)
      .innerJoin(userRestaurants, eq(users.id, userRestaurants.userId))
      .where(eq(userRestaurants.restaurantId, restaurantId));

    res.json({ users: rows, restaurant: { id: restaurant.id, name: restaurant.name } });
  } catch (error) {
    next(error);
  }
});

export default router;
