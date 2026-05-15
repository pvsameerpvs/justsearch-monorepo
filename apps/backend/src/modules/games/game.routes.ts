import { Router } from 'express';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { db } from '../../db';
import { games } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  config: z.record(z.unknown()).optional(),
  isActive: z.boolean().optional(),
});

// GET /api/v1/games — list all games (super-admin only)
router.get('/', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const list = await db.select().from(games).orderBy(desc(games.createdAt));
    res.json({ games: list });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/games/active — list active games (public, no auth)
router.get('/active', async (_req, res, next) => {
  try {
    const list = await db.select().from(games).where(eq(games.isActive, true));
    res.json({ games: list });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/games/:id — toggle active/inactive, update config (super-admin only)
router.patch('/:id', authMiddleware, requireRole('super_admin'), async (req, res, next) => {
  try {
    const body = updateSchema.parse(req.body);
    if (body.config) {
      const [existing] = await db.select({ config: games.config }).from(games).where(eq(games.id, req.params.id)).limit(1);
      if (existing) {
        const merged = { ...(existing.config as Record<string, unknown>), ...body.config };
        body.config = merged;
      }
    }
    const [updated] = await db
      .update(games)
      .set(body)
      .where(eq(games.id, req.params.id))
      .returning();
    if (!updated) return res.status(404).json({ error: 'Game not found' });
    res.json({ game: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
