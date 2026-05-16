import { Router } from 'express';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { db } from '../../db';
import { games } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

const createSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  config: z.record(z.unknown()).optional(),
  isActive: z.boolean().optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  config: z.record(z.unknown()).optional(),
  isActive: z.boolean().optional(),
});

router.get('/', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const list = await db.select().from(games).orderBy(desc(games.createdAt));
    res.json({ games: list });
  } catch (error) {
    next(error);
  }
});

router.get('/active', async (_req, res, next) => {
  try {
    const list = await db.select().from(games).where(eq(games.isActive, true));
    res.json({ games: list });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireRole('super_admin'), async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    const values = {
      name: body.name,
      type: body.type,
      config: body.config ?? {},
      isActive: body.isActive ?? true,
      createdBy: req.auth?.userId,
    };
    const [game] = await db.insert(games).values(values).returning();
    res.status(201).json({ game });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', authMiddleware, requireRole('super_admin'), async (req, res, next) => {
  try {
    const body = updateSchema.parse(req.body);
    if (body.config) {
      const [existing] = await db
        .select({ config: games.config })
        .from(games)
        .where(eq(games.id, req.params.id))
        .limit(1);
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
