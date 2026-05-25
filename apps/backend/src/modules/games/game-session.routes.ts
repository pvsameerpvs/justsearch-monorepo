import { Router } from 'express';
import { z } from 'zod';
import { eq, and, sql, gte } from 'drizzle-orm';
import { db } from '../../db';
import { games, loyaltyPoints } from '../../db/schema';
import { authMiddleware } from '../../middleware/auth.middleware';
import { calculatePoints, extractScoringConfig, DAILY_HARD_CAP } from '../../lib/scoring';
import { t, mapRow, mapRows } from '../../lib/tenant-sql';

const router = Router();
router.use(authMiddleware);

const createSessionSchema = z.object({
  gameId: z.string().min(1),
  rawScore: z.number().min(0),
  level: z.number().optional(),
});

// POST /api/v1/games/sessions — record a game session and award points
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

    // Look up game by localGameId inside config JSONB (works with both old uuid id and new varchar id)
    const [game] = await db
      .select()
      .from(games)
      .where(eq(sql`config->>'localGameId'`, body.gameId))
      .limit(1);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (!game.isActive) return res.status(400).json({ error: 'Game is not active' });

    const scoringConfig = extractScoringConfig(game.config as Record<string, unknown>);
    const pointsAwarded = calculatePoints(body.rawScore, scoringConfig);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const schemaName = req.tenant.schemaName;

    const rows = await db.execute<Record<string, unknown>>(sql`
      SELECT coalesce(sum(points_awarded), 0) AS total
      FROM ${t(schemaName, 'game_sessions')}
      WHERE customer_id = ${customerId} AND played_at >= ${startOfDay.toISOString()}
    `);

    const totalToday = Number(rows[0]?.total ?? 0);
    const capped = Math.min(pointsAwarded, Math.max(0, DAILY_HARD_CAP - totalToday));

    const sessionRows = await db.execute<Record<string, unknown>>(sql`
      INSERT INTO ${t(schemaName, 'game_sessions')} (
        restaurant_id, game_id, customer_id, score, points_awarded, level, scoring_version, metadata
      ) VALUES (
        ${restaurantId}, ${body.gameId}, ${customerId}, ${body.rawScore}, ${capped},
        ${body.level || null}, ${scoringConfig.scoringVersion},
        ${JSON.stringify({ rawScore: body.rawScore, config: scoringConfig })}
      ) RETURNING *
    `);
    const session = mapRow(sessionRows[0]);

    // Upsert global loyalty_points
    await db.insert(loyaltyPoints).values({
      userId: customerId,
      points: capped,
      totalEarned: capped,
      totalRedeemed: 0,
    }).onConflictDoUpdate({
      target: loyaltyPoints.userId,
      set: {
        points: sql`loyalty_points.points + ${capped}`,
        totalEarned: sql`loyalty_points.total_earned + ${capped}`,
        updatedAt: new Date(),
      },
    });

    res.json({ pointsAwarded: capped, totalToday: totalToday + capped, dailyCap: DAILY_HARD_CAP, session });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/games/sessions/total-points — get total loyalty points for authenticated user
router.get('/sessions/total-points', async (req, res, next) => {
  try {
    if (!req.auth?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const [row] = await db
      .select()
      .from(loyaltyPoints)
      .where(eq(loyaltyPoints.userId, req.auth.id))
      .limit(1);

    res.json({
      points: row?.points ?? 0,
      totalEarned: row?.totalEarned ?? 0,
      totalRedeemed: row?.totalRedeemed ?? 0,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/games/sessions/my-stats — get per-game stats for authenticated user
router.get('/sessions/my-stats', async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }
    if (!req.auth?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const sessions = mapRows(await db.execute<Record<string, unknown>>(sql`
      SELECT game_id, score, points_awarded, level, played_at
      FROM ${t(req.tenant.schemaName, 'game_sessions')}
      WHERE customer_id = ${req.auth.id}
      ORDER BY played_at
    `));

    res.json({ sessions });
  } catch (error) {
    next(error);
  }
});

export default router;
