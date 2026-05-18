import { Router } from 'express';
import { z } from 'zod';
import { eq, desc, and, or, sql } from 'drizzle-orm';
import { db } from '../../db';
import { advertisements } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

const createSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  mediaType: z.enum(['image', 'video', 'gif']).optional(),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
  duration: z.number().int().positive().optional(),
  category: z.string().optional(),
  budget: z.coerce.number().nonnegative().optional(),
  costPerImpression: z.coerce.number().nonnegative().optional(),
  assignedGames: z.array(z.string()).optional(),
  targetRestaurants: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

const updateSchema = createSchema.partial();

router.get('/', requireRole('super_admin'), async (_req, res, next) => {
  try {
    const list = await db.select().from(advertisements).orderBy(desc(advertisements.createdAt));
    res.json({ advertisements: list });
  } catch (error) { next(error); }
});

router.post('/', requireRole('super_admin'), async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    const values = {
      ...body,
      budget: body.budget !== undefined ? String(body.budget) : undefined,
      costPerImpression: body.costPerImpression !== undefined ? String(body.costPerImpression) : undefined,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    };
    const [ad] = await db.insert(advertisements).values(values).returning();
    res.status(201).json({ advertisement: ad });
  } catch (error) { next(error); }
});

router.patch('/:id', requireRole('super_admin'), async (req, res, next) => {
  try {
    const body = updateSchema.parse(req.body);
    const values: Record<string, unknown> = {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    };
    if (body.budget !== undefined) values.budget = String(body.budget);
    if (body.costPerImpression !== undefined) values.costPerImpression = String(body.costPerImpression);
    const [updated] = await db
      .update(advertisements)
      .set(values)
      .where(eq(advertisements.id, req.params.id))
      .returning();
    if (!updated) return res.status(404).json({ error: 'Advertisement not found' });
    res.json({ advertisement: updated });
  } catch (error) { next(error); }
});

router.delete('/:id', requireRole('super_admin'), async (req, res, next) => {
  try {
    await db.delete(advertisements).where(eq(advertisements.id, req.params.id));
    res.status(204).send();
  } catch (error) { next(error); }
});

// POST /api/v1/advertisements/:id/impression — track ad view, auto-deactivate if budget exhausted
router.post('/:id/impression', async (req, res, next) => {
  try {
    const id = req.params.id;
    const [ad] = await db.select().from(advertisements).where(eq(advertisements.id, id)).limit(1);
    if (!ad) return res.status(404).json({ error: 'Ad not found' });

    const newImpressions = (ad.impressions ?? 0) + 1;
    const costPerImp = Number(ad.costPerImpression ?? 0);
    const budget = Number(ad.budget ?? 0);
    const newSpent = costPerImp * newImpressions;
    const isBudgetExhausted = budget > 0 && newSpent >= budget;

    await db
      .update(advertisements)
      .set({
        impressions: newImpressions,
        spent: String(newSpent),
        isActive: isBudgetExhausted ? false : ad.isActive,
      })
      .where(eq(advertisements.id, id));

    res.json({ success: true, impressions: newImpressions, spent: newSpent, budgetExhausted: isBudgetExhausted });
  } catch (error) { next(error); }
});

export default router;

// Safely parse JSONB array columns (handles null, string, array)
function safeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string') {
    try { return JSON.parse(value) as string[]; } catch { return []; }
  }
  return [];
}

// Public routes — no auth required
export const publicAdRoutes = Router();

publicAdRoutes.get('/active', async (req, res, next) => {
  try {
    const gameId = req.query.gameId as string | undefined;
    const restaurantId = req.query.restaurantId as string | undefined;
    const excludeCategories = req.query.excludeCategories as string | undefined;

    // Step 1: Fetch all active ads from Drizzle ORM (safe, no raw SQL)
    const allAds = await db.select().from(advertisements).where(eq(advertisements.isActive, true));

    // Step 2: Filter in memory (ads table is small — platform-wide, not per-tenant)
    let result = allAds.filter((ad) => {
      // Budget check: skip if budget is set and exhausted
      const budget = Number(ad.budget ?? 0);
      const spent = Number(ad.spent ?? 0);
      if (budget > 0 && spent >= budget) return false;

      // Restaurant check: platform ads run everywhere; restaurant-specific ads check target
      if (restaurantId && ad.type !== 'platform') {
        const targets = safeStringArray(ad.targetRestaurants);
        if (targets.length > 0 && !targets.includes(restaurantId)) return false;
      }

      // Game check: ads with no assigned games run on all games
      if (gameId) {
        const gamesArr = safeStringArray(ad.assignedGames);
        if (gamesArr.length > 0 && !gamesArr.includes(gameId)) return false;
      }

      return true;
    });

    // Step 3: Exclude categories client-side if provided
    if (excludeCategories) {
      const blocked = new Set(excludeCategories.split(','));
      result = result.filter((ad) => !ad.category || !blocked.has(ad.category));
    }

    // Step 4: Camel-case the response so frontend gets consistent field names
    const camelized = result.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      mediaType: row.mediaType,
      content: row.content,
      imageUrl: row.imageUrl,
      duration: row.duration,
      category: row.category,
      budget: row.budget,
      costPerImpression: row.costPerImpression,
      impressions: row.impressions,
      spent: row.spent,
      assignedGames: safeStringArray(row.assignedGames),
      targetRestaurants: safeStringArray(row.targetRestaurants),
      isActive: row.isActive,
      startDate: row.startDate,
      endDate: row.endDate,
      createdAt: row.createdAt,
    }));

    // Step 5: Shuffle for smart rotation
    const shuffled = camelized.sort(() => Math.random() - 0.5);

    res.json({ advertisements: shuffled });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Ads] Public fetch error:', error);
    next(error);
  }
});

// Debug endpoint: list all active ads with their match status (no auth)
publicAdRoutes.get('/debug', async (req, res, next) => {
  try {
    const allAds = await db.select().from(advertisements).where(eq(advertisements.isActive, true));
    res.json({
      count: allAds.length,
      ads: allAds.map((r) => ({
        id: r.id,
        name: r.name,
        type: r.type,
        assignedGames: safeStringArray(r.assignedGames),
        targetRestaurants: safeStringArray(r.targetRestaurants),
        isActive: r.isActive,
        budget: r.budget,
        spent: r.spent,
      })),
    });
  } catch (error) { next(error); }
});
