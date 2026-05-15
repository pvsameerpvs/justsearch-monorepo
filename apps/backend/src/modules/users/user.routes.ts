import { Router } from 'express';
import { eq, desc } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/users — list customers for current tenant
router.get('/', requireRole('owner', 'manager', 'cashier'), async (req, res, next) => {
  try {
    if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });

    const list = await db
      .select()
      .from(users)
      .where(eq(users.restaurantId, req.tenant.id))
      .orderBy(desc(users.createdAt));

    res.json({ users: list });
  } catch (error) {
    next(error);
  }
});

export default router;
