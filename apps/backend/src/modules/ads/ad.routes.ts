import { Router } from 'express';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { db } from '../../db';
import { advertisements, adBillingEvents, adCategories } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

const createSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  mediaType: z.enum(['image', 'video', 'gif']).optional(),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
  linkUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  mediaUrlLow: z.string().optional(),
  duration: z.number().int().positive().optional(),
  category: z.string().max(50).optional(),
  budget: z.coerce.number().nonnegative().optional(),
  costPerView3s: z.coerce.number().nonnegative().optional(),
  costPerViewFull: z.coerce.number().nonnegative().optional(),
  costPerClick: z.coerce.number().nonnegative().optional(),
  assignedGames: z.array(z.string()).optional(),
  targetRestaurants: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  visibility: z.object({
    title: z.boolean(),
    description: z.boolean(),
    linkUrl: z.boolean(),
  }).optional(),
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
      costPerView3s: body.costPerView3s !== undefined ? String(body.costPerView3s) : undefined,
      costPerViewFull: body.costPerViewFull !== undefined ? String(body.costPerViewFull) : undefined,
      costPerClick: body.costPerClick !== undefined ? String(body.costPerClick) : undefined,
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
  if (body.costPerView3s !== undefined) values.costPerView3s = String(body.costPerView3s);
  if (body.costPerViewFull !== undefined) values.costPerViewFull = String(body.costPerViewFull);
  if (body.costPerClick !== undefined) values.costPerClick = String(body.costPerClick);
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
    const now = new Date();

    // Step 1: Fetch all active ads from Drizzle ORM (safe, no raw SQL)
    const allAds = await db.select().from(advertisements).where(eq(advertisements.isActive, true));

    // Step 2: Filter in memory (ads table is small — platform-wide, not per-tenant)
    let result = allAds.filter((ad) => {
      // Date range check: skip if not yet started or already expired
      if (ad.startDate && new Date(ad.startDate) > now) return false;
      if (ad.endDate && new Date(ad.endDate) < now) return false;

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
      linkUrl: row.linkUrl,
      mediaUrlLow: row.mediaUrlLow,
      duration: row.duration,
      category: row.category,
      budget: row.budget,
      costPerView3s: row.costPerView3s,
      costPerViewFull: row.costPerViewFull,
      costPerClick: row.costPerClick,
      impressions: row.impressions,
      spent: row.spent,
      totalViews3s: row.totalViews3s,
      totalViewsFull: row.totalViewsFull,
      totalClicks: row.totalClicks,
      totalConfirmedClicks: row.totalConfirmedClicks,
      totalAbandonedClicks: row.totalAbandonedClicks,
      revenueJustsearch: row.revenueJustsearch,
      revenueRestaurant: row.revenueRestaurant,
      assignedGames: safeStringArray(row.assignedGames),
      targetRestaurants: safeStringArray(row.targetRestaurants),
      isActive: row.isActive,
      startDate: row.startDate,
      endDate: row.endDate,
      createdAt: row.createdAt,
      visibility: row.visibility,
    }));

    // Step 5: Shuffle for smart rotation
    const shuffled = camelized.sort(() => Math.random() - 0.5);

    res.json({ advertisements: shuffled });
  } catch (error) { next(error); }
});

// POST /api/v1/advertisements/public/:id/event — track ad view / click / skip events
publicAdRoutes.post('/:id/event', async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = z.object({
      eventType: z.enum(['view_3s', 'view_full', 'click_pending', 'skip']),
      deviceFingerprint: z.string().optional(),
    }).parse(req.body);

    const [ad] = await db.select().from(advertisements).where(eq(advertisements.id, id)).limit(1);
    if (!ad) return res.status(404).json({ error: 'Ad not found' });

    // Cost per event — uses the campaign's custom pricing (defaults: 0.30, 1.00, 5.00)
    // skip events are free (no charge) but tracked for analytics
    const EVENT_COSTS: Record<string, number> = {
      view_3s: Number(ad.costPerView3s ?? 0.30),
      view_full: Number(ad.costPerViewFull ?? 1.00),
      click_pending: 0,
      skip: 0,
    };
    const amount = EVENT_COSTS[body.eventType] ?? 0;

    // Determine revenue split based on ad type
    const isRestaurantBrought = ad.type === 'restaurant_brought';
    const revenueJustsearch = isRestaurantBrought ? amount * 0.60 : amount;
    const revenueRestaurant = isRestaurantBrought ? amount * 0.40 : 0;

    // Insert billing event
    const [event] = await db.insert(adBillingEvents).values({
      adId: id,
      restaurantId: isRestaurantBrought ? (safeStringArray(ad.targetRestaurants)[0] ?? null) : null,
      eventType: body.eventType,
      amount: String(amount),
      isConfirmed: body.eventType !== 'click_pending',
      deviceFingerprint: body.deviceFingerprint ?? null,
    }).returning();

    // Update ad counters
    const counterUpdates: Record<string, number> = {};
    if (body.eventType === 'view_3s') {
      counterUpdates.totalViews3s = (ad.totalViews3s ?? 0) + 1;
      counterUpdates.impressions = (ad.impressions ?? 0) + 1;
    }
    if (body.eventType === 'view_full') counterUpdates.totalViewsFull = (ad.totalViewsFull ?? 0) + 1;
    if (body.eventType === 'click_pending') counterUpdates.totalClicks = (ad.totalClicks ?? 0) + 1;
    if (body.eventType === 'skip') counterUpdates.totalSkips = (ad.totalSkips ?? 0) + 1;

    const newSpent = Number(ad.spent ?? 0) + amount;
    const budget = Number(ad.budget ?? 0);
    const isBudgetExhausted = budget > 0 && newSpent >= budget;

    await db
      .update(advertisements)
      .set({
        ...counterUpdates,
        spent: String(newSpent),
        revenueJustsearch: String(Number(ad.revenueJustsearch ?? 0) + revenueJustsearch),
        revenueRestaurant: String(Number(ad.revenueRestaurant ?? 0) + revenueRestaurant),
        isActive: isBudgetExhausted ? false : ad.isActive,
      })
      .where(eq(advertisements.id, id));

    res.json({ success: true, eventType: body.eventType, amount, budgetExhausted: isBudgetExhausted, eventId: event.id });
  } catch (error) { next(error); }
});

// POST /api/v1/advertisements/public/:id/click-confirm — confirm a real click (user stayed > 3s)
publicAdRoutes.post('/:id/click-confirm', async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = z.object({ eventId: z.string().uuid() }).parse(req.body);

    const [ad] = await db.select().from(advertisements).where(eq(advertisements.id, id)).limit(1);
    if (!ad) return res.status(404).json({ error: 'Ad not found' });

    const clickCost = Number(ad.costPerClick ?? 5.00);
    const isRestaurantBrought = ad.type === 'restaurant_brought';
    const revenueJustsearch = isRestaurantBrought ? clickCost * 0.60 : clickCost;
    const revenueRestaurant = isRestaurantBrought ? clickCost * 0.40 : 0;

    // Update ONLY the specific pending click event to confirmed
    await db
      .update(adBillingEvents)
      .set({ eventType: 'click_confirmed', amount: String(clickCost), isConfirmed: true })
      .where(
        eq(adBillingEvents.id, body.eventId)
      );

    const newSpent = Number(ad.spent ?? 0) + clickCost;
    const budget = Number(ad.budget ?? 0);
    const isBudgetExhausted = budget > 0 && newSpent >= budget;

    await db
      .update(advertisements)
      .set({
        totalConfirmedClicks: (ad.totalConfirmedClicks ?? 0) + 1,
        spent: String(newSpent),
        revenueJustsearch: String(Number(ad.revenueJustsearch ?? 0) + revenueJustsearch),
        revenueRestaurant: String(Number(ad.revenueRestaurant ?? 0) + revenueRestaurant),
        isActive: isBudgetExhausted ? false : ad.isActive,
      })
      .where(eq(advertisements.id, id));

    res.json({ success: true, confirmed: true, amount: clickCost, budgetExhausted: isBudgetExhausted });
  } catch (error) { next(error); }
});

// POST /api/v1/advertisements/public/:id/click-abandon — mark click as accidental (no charge)
publicAdRoutes.post('/:id/click-abandon', async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = z.object({ eventId: z.string().uuid() }).parse(req.body);

    const [ad] = await db.select().from(advertisements).where(eq(advertisements.id, id)).limit(1);
    if (!ad) return res.status(404).json({ error: 'Ad not found' });

    // Mark ONLY the specific pending click as abandoned (no cost)
    await db
      .update(adBillingEvents)
      .set({ eventType: 'click_abandoned', amount: '0', isConfirmed: false })
      .where(eq(adBillingEvents.id, body.eventId));

    await db
      .update(advertisements)
      .set({ totalAbandonedClicks: (ad.totalAbandonedClicks ?? 0) + 1 })
      .where(eq(advertisements.id, id));

    res.json({ success: true, abandoned: true, amount: 0 });
  } catch (error) { next(error); }
});

// GET /api/v1/advertisements/:id/analytics — detailed breakdown (super-admin only)
router.get('/:id/analytics', requireRole('super_admin'), async (req, res, next) => {
  try {
    const id = req.params.id;
    const [ad] = await db.select().from(advertisements).where(eq(advertisements.id, id)).limit(1);
    if (!ad) return res.status(404).json({ error: 'Ad not found' });

    const events = await db.select().from(adBillingEvents).where(eq(adBillingEvents.adId, id));

    const analytics = {
      id: ad.id,
      name: ad.name,
      budget: Number(ad.budget ?? 0),
      spent: Number(ad.spent ?? 0),
      totalViews3s: ad.totalViews3s ?? 0,
      totalViewsFull: ad.totalViewsFull ?? 0,
      totalClicks: ad.totalClicks ?? 0,
      totalConfirmedClicks: ad.totalConfirmedClicks ?? 0,
      totalAbandonedClicks: ad.totalAbandonedClicks ?? 0,
      revenueJustsearch: Number(ad.revenueJustsearch ?? 0),
      revenueRestaurant: Number(ad.revenueRestaurant ?? 0),
      ctr: (ad.totalViewsFull ?? 0) > 0 ? ((ad.totalClicks ?? 0) / (ad.totalViewsFull ?? 0)) * 100 : 0,
      confirmationRate: (ad.totalClicks ?? 0) > 0 ? ((ad.totalConfirmedClicks ?? 0) / (ad.totalClicks ?? 0)) * 100 : 0,
      events: events.map((e) => ({
        id: e.id,
        eventType: e.eventType,
        amount: Number(e.amount),
        isConfirmed: e.isConfirmed,
        createdAt: e.createdAt,
      })),
    };

    res.json({ analytics });
  } catch (error) { next(error); }
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

// GET /api/v1/advertisements/public/categories — list all active ad categories (public, no auth)
publicAdRoutes.get('/categories', async (req, res, next) => {
  try {
    const list = await db.select().from(adCategories).where(eq(adCategories.isActive, true)).orderBy(adCategories.name);
    res.json({ categories: list });
  } catch (error) { next(error); }
});

// POST /api/v1/advertisements/categories — create new category (super-admin only)
router.post('/categories', requireRole('super_admin'), async (req, res, next) => {
  try {
    const body = z.object({ name: z.string().min(1).max(50) }).parse(req.body);
    const normalizedName = body.name.trim();

    // Check if category already exists (including inactive)
    const existing = await db
      .select()
      .from(adCategories)
      .where(eq(adCategories.name, normalizedName))
      .limit(1);

    if (existing.length > 0) {
      // Reactivate if it was soft-deleted
      if (!existing[0].isActive) {
        const [reactivated] = await db
          .update(adCategories)
          .set({ isActive: true })
          .where(eq(adCategories.id, existing[0].id))
          .returning();
        return res.status(200).json({ category: reactivated });
      }
      // Already active — return it without error
      return res.status(200).json({ category: existing[0] });
    }

    const [category] = await db.insert(adCategories).values({ name: normalizedName }).returning();
    res.status(201).json({ category });
  } catch (error) { next(error); }
});

// DELETE /api/v1/advertisements/categories/:id — soft-delete category (super-admin only)
router.delete('/categories/:id', requireRole('super_admin'), async (req, res, next) => {
  try {
    const [updated] = await db
      .update(adCategories)
      .set({ isActive: false })
      .where(eq(adCategories.id, req.params.id))
      .returning();
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true });
  } catch (error) { next(error); }
});

export default router;
