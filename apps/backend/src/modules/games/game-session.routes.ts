import { Router } from 'express';
import { z } from 'zod';
import { eq, and, sql, gte } from 'drizzle-orm';
import { db } from '../../db';
import { games, gameSessions } from '../../db/schema';
import { authMiddleware } from '../../middleware/auth.middleware';
import { calculatePoints, extractScoringConfig, DAILY_HARD_CAP } from '../../lib/scoring';

const router = Router();
router.use(authMiddleware);

const createSessionSchema = z.object({
  gameId: z.string().min(1),
  rawScore: z.number().min(0),
  level: z.number().optional(),
});

router.post('/sessions', async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }
    if (!req.auth?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const body = createSessionSchema.parse(req.body);
    const customerId = req.auth.id;
    const restaurantId = req.tenant.id;

    const [game] = await db.select().from(games).where(eq(games.id, body.gameId)).limit(1);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (!game.isActive) return res.status(400).json({ error: 'Game is not active' });

    const scoringConfig = extractScoringConfig(game.config as Record<string, unknown>);
    const pointsAwarded = calculatePoints(body.rawScore, scoringConfig);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const rows = await db
      .select({ total: sql<number>`coalesce(sum(points_awarded), 0)` })
      .from(gameSessions)
      .where(and(eq(gameSessions.customerId, customerId), gte(gameSessions.playedAt, startOfDay)));

    const totalToday = rows[0]?.total ?? 0;
    const capped = Math.min(pointsAwarded, Math.max(0, DAILY_HARD_CAP - totalToday));

    await db.insert(gameSessions).values({
      restaurantId,
      gameId: body.gameId,
      customerId,
      score: body.rawScore,
      pointsAwarded: capped,
      level: body.level,
      scoringVersion: scoringConfig.scoringVersion,
      metadata: { rawScore: body.rawScore, config: scoringConfig },
    });

    res.json({ pointsAwarded: capped, totalToday: totalToday + capped, dailyCap: DAILY_HARD_CAP });
  } catch (error) {
    next(error);
  }
});

export default router;
