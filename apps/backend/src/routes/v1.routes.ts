import { Router } from 'express';
import { db } from '../db';
import { restaurants } from '../db/schema/restaurants';
import { menus, menuItems, menuCategories } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import authRoutes from '../modules/auth/auth.routes';
import orderRoutes from '../modules/orders/order.routes';
import orderDriverRoutes from '../modules/orders/order-driver.routes';
import orderPaymentRoutes from '../modules/orders/order-payment.routes';
import orderCloseoutRoutes from '../modules/orders/order-closeout.routes';
import restaurantAdminRoutes from '../modules/restaurants/restaurant.routes';

const router = Router();

// Public health endpoint
router.get('/', (_req, res) => {
  res.json({ message: 'JustSearch API v1', version: '1.0.0' });
});

// Auth routes (tenant-scoped)
router.use('/auth', authRoutes);

// Restaurant admin routes (super-admin)
router.use('/restaurants', restaurantAdminRoutes);

// Order routes (authenticated)
router.use('/orders', orderRoutes);
router.use('/orders', orderDriverRoutes);
router.use('/orders', orderPaymentRoutes);

// Close-of-day routes
router.use('/close-day', orderCloseoutRoutes);

// GET /api/v1/restaurants/current — resolve by subdomain
router.get('/restaurants/current', async (req, res, next) => {
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

// GET /api/v1/menus — public menu for current tenant
router.get('/menus', async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const categories = await db
      .select()
      .from(menuCategories)
      .where(
        and(
          eq(menuCategories.restaurantId, req.tenant.id),
          eq(menuCategories.status, 'active')
        )
      )
      .orderBy(menuCategories.sortOrder);

    const items = await db
      .select()
      .from(menuItems)
      .where(
        and(
          eq(menuItems.restaurantId, req.tenant.id),
          eq(menuItems.isAvailable, true)
        )
      )
      .orderBy(menuItems.sortOrder);

    const menuData = categories.map((category) => ({
      ...category,
      items: items.filter((item) => item.categoryId === category.id),
    }));

    res.json({ categories: menuData });
  } catch (error) {
    next(error);
  }
});

export default router;
