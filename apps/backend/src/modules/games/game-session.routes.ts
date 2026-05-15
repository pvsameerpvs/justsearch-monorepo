import { Router } from 'express';
import { z } from 'zod';
import { eq, and, gte, sql } from 'drizzle-orm';
import { db } from '../../db';
import { games, gameSessions } from '../../db/schema';
import { calculatePoints, extractScoringConfig, DAILY_HARD_CAP } from '../../lib/scoring';

const router = Router();

const createSessionSchema = z.object({
  gameId: z.string().min(1),
  rawScore: z.number().min(0),
  level: z.number().optional(),
  customerId: z.string().optional(),
  restaurantId: z.string().optional(),
});

router.post('/sessions', async (req, res, next) => {
  try {
    const body = createSessionSchema.parse(req.body);

    const [game] = await db.select().from(games).where(eq(games.id, body.gameId)).limit(1);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (!game.isActive) return res.status(400).json({ error: 'Game is not active' });

    const scoringConfig = extractScoringConfig(game.config as Record<string, unknown>);
    const pointsAwarded = calculatePoints(body.rawScore, scoringConfig);
    let totalToday = 0;

    if (body.customerId) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const rows = await db
        .select({ total: sql<number>`coalesce(sum(points_awarded), 0)` })
        .from(gameSessions)
        .where(and(eq(gameSessions.customerId, body.customerId), gte(gameSessions.playedAt, startOfDay)));

      totalToday = rows[0]?.total ?? 0;
    }

    const capped = body.customerId ? Math.min(pointsAwarded, Math.max(0, DAILY_HARD_CAP - totalToday)) : pointsAwarded;

    if (body.restaurantId) {
      await db.insert(gameSessions).values({
        restaurantId: body.restaurantId,
        gameId: body.gameId,
        customerId: body.customerId || undefined,
        score: body.rawScore,
        pointsAwarded: capped,
        level: body.level,
        scoringVersion: scoringConfig.scoringVersion,
        metadata: { rawScore: body.rawScore, config: scoringConfig },
      });
    }

    res.json({ pointsAwarded: capped, totalToday: totalToday + capped, dailyCap: DAILY_HARD_CAP });
  } catch (error) {
    next(error);
  }
});

export default router;
