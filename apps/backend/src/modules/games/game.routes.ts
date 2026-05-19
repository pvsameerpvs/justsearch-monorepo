import { Router } from 'express';
import { randomUUID } from 'crypto';
import { eq, desc } from 'drizzle-orm';
import { db } from '../../db';
import { games } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';
import { createGameSchema, updateGameSchema } from './game.schema';
import { updateGame } from './game.service';

const router = Router();

// Public: active games list (customer frontend reads this without auth)
router.get('/active', async (_req, res, next) => {
  try {
    const list = await db.select().from(games).where(eq(games.isActive, true));
    res.json({ games: list });
  } catch (error) { next(error); }
});

// Auth required for admin-only routes below
router.use(authMiddleware);

router.get('/', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const list = await db.select().from(games).orderBy(desc(games.createdAt));
    res.json({ games: list });
  } catch (error) { next(error); }
});

router.post('/', requireRole('super_admin'), async (req, res, next) => {
  try {
    const body = createGameSchema.parse(req.body);
    const [game] = await db.insert(games).values({
      id: body.id || randomUUID(),
      name: body.name,
      type: body.type,
      config: body.config ?? {},
      isActive: body.isActive ?? true,
      createdBy: req.auth?.id,
    }).returning();
    res.status(201).json({ game });
  } catch (error) { next(error); }
});

router.patch('/:id', requireRole('super_admin'), async (req, res, next) => {
  try {
    const body = updateGameSchema.parse(req.body);
    const updated = await updateGame(req.params.id, body);
    if (!updated) return res.status(404).json({ error: 'Game not found' });
    res.json({ game: updated });
  } catch (error) { next(error); }
});

export default router;
