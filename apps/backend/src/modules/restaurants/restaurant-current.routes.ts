import { Router } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { restaurants } from '../../db/schema';
import { authMiddleware, requireRole } from '../../middleware/auth.middleware';

const updateCurrentSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  heroImageUrl: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  tagline: z.string().max(500).optional(),
  description: z.string().max(2000).optional(),
  category: z.string().optional(),
  cuisine: z.union([z.array(z.string()), z.string()]).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().nullable(),
  website: z.string().optional().nullable(),
  googleMapsUrl: z.string().optional().nullable(),
  googlePlaceId: z.string().optional().nullable(),
  openingHours: z.array(z.object({
    day: z.string(),
    open: z.string(),
    close: z.string(),
    isOpen: z.boolean(),
    is24Hour: z.boolean().optional(),
    isToday: z.boolean().optional(),
  })).optional(),
  socials: z.array(z.object({
    platform: z.string(),
    url: z.string(),
    handle: z.string(),
  })).optional(),
  overallRating: z.number().min(0).max(5).optional(),
  totalReviews: z.number().int().nonnegative().optional(),
  isPureVeg: z.boolean().optional(),
  delivery: z.object({
    enabled: z.boolean(),
    maxRadiusKm: z.number().positive().max(50),
    restaurantLat: z.number().min(-90).max(90),
    restaurantLng: z.number().min(-180).max(180),
    emirates: z.array(z.enum(['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'])).max(7).optional(),
    tiers: z.array(z.object({
      minKm: z.number().nonnegative(),
      maxKm: z.number().positive(),
      fee: z.number().nonnegative(),
    })).max(10),
  }).optional(),
});

const router = Router();

// GET /api/v1/restaurants/current — resolve by subdomain
router.get('/current', async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const [restaurant] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, req.tenant.id))
      .limit(1);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({
      id: restaurant.id,
      slug: restaurant.slug,
      subdomain: restaurant.subdomain,
      name: restaurant.name,
      status: restaurant.status,
      theme: restaurant.theme,
      settings: restaurant.settings,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/restaurants/current — update current tenant restaurant
router.patch('/current', authMiddleware, requireRole('owner', 'manager', 'super_admin'), async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const body = updateCurrentSchema.parse(req.body);

    const [existing] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, req.tenant.id))
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Separate direct columns from settings fields
    const directColumns: Record<string, unknown> = {};
    const settingsUpdate: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(body)) {
      if (value === undefined) continue;
      if (key === 'name') {
        directColumns.name = value;
      } else {
        settingsUpdate[key] = value;
      }
    }

    const currentSettings = (typeof existing.settings === 'object' && existing.settings !== null)
      ? (existing.settings as Record<string, unknown>)
      : {};

    const mergedSettings = { ...currentSettings, ...settingsUpdate };

    const updateData: Record<string, unknown> = {
      settings: mergedSettings,
      updatedAt: new Date(),
    };

    if ('name' in directColumns) {
      updateData.name = directColumns.name;
    }

    const [updated] = await db
      .update(restaurants)
      .set(updateData)
      .where(eq(restaurants.id, req.tenant.id))
      .returning();

    res.json({
      id: updated.id,
      slug: updated.slug,
      subdomain: updated.subdomain,
      name: updated.name,
      status: updated.status,
      theme: updated.theme,
      settings: updated.settings,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
