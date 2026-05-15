import { Router } from 'express';
import { desc } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const list = await db.select().from(users).orderBy(desc(users.createdAt));
    res.json({ users: list });
  } catch (error) {
    next(error);
  }
});

export default router;
