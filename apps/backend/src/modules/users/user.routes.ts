import { Router } from 'express';
import { eq, desc, inArray } from 'drizzle-orm';
import { db } from '../../db';
import { users, userRestaurants } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/users — list customers for current tenant
router.get('/', requireRole('owner', 'manager', 'cashier'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const links = await db
      .select({ userId: userRestaurants.userId })
      .from(userRestaurants)
      .where(eq(userRestaurants.restaurantId, req.tenant.id));

    const userIds = links.map((l) => l.userId);
    if (userIds.length === 0) {
      return res.json({ users: [] });
    }

    const list = await db
      .select()
      .from(users)
      .where(inArray(users.id, userIds))
      .orderBy(desc(users.createdAt));

    res.json({ users: list });
  } catch (error) {
    next(error);
  }
});

export default router;
