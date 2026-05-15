import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import orderRoutes from '../modules/orders/order.routes';
import orderCloseoutRoutes from '../modules/orders/order-closeout.routes';
import restaurantAdminRoutes from '../modules/restaurants/restaurant.routes';
import restaurantCurrentRoutes from '../modules/restaurants/restaurant-current.routes';
import menuPublicRoutes from '../modules/menus/menu-public.routes';
import menuItemRoutes from '../modules/menu/menu-item.routes';
import menuCategoryRoutes from '../modules/menu/menu-category.routes';
import deliveryAgentRoutes from '../modules/delivery/delivery.routes';
import voucherRoutes from '../modules/vouchers/voucher.routes';
import userRoutes from '../modules/users/user.routes';
import userAdminRoutes from '../modules/users/user-admin.routes';
import gameRoutes from '../modules/games/game.routes';
import adRoutes from '../modules/ads/ad.routes';
import revenueRoutes from '../modules/revenue/revenue.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';
import analyticsAdminRoutes from '../modules/analytics/analytics-admin.routes';

const router = Router();

// Public health endpoint
router.get('/', (_req, res) => {
  res.json({ message: 'JustSearch API v1', version: '1.0.0' });
});

// Auth routes (tenant-scoped)
router.use('/auth', authRoutes);

// Restaurant admin routes (super-admin)
router.use('/restaurants', restaurantAdminRoutes);
router.use('/restaurants', restaurantCurrentRoutes);

// Public menu routes (tenant-scoped)
router.use('/menus', menuPublicRoutes);

// Menu management routes (authenticated)
router.use('/menu-items', menuItemRoutes);
router.use('/menu-categories', menuCategoryRoutes);

// Order routes (authenticated)
router.use('/orders', orderRoutes);

// Delivery agents (authenticated)
router.use('/delivery-agents', deliveryAgentRoutes);

// Vouchers / promo codes (authenticated)
router.use('/vouchers', voucherRoutes);

// Customers / users (authenticated)
router.use('/users', userRoutes);

// Admin users (super-admin, platform-wide)
router.use('/admin/users', userAdminRoutes);

// Games (super-admin)
router.use('/games', gameRoutes);

// Advertisements (super-admin)
router.use('/advertisements', adRoutes);

// Revenue (super-admin)
router.use('/revenue', revenueRoutes);

// Analytics (authenticated)
router.use('/analytics', analyticsRoutes);
router.use('/analytics', analyticsAdminRoutes);

// Close-of-day routes (authenticated inside closeout router)
router.use('/close-day', orderCloseoutRoutes);

export default router;
