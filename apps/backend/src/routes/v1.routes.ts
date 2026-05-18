import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import orderRoutes from '../modules/orders/order.routes';
import orderCloseoutRoutes from '../modules/orders/order-closeout.routes';
import restaurantAdminRoutes from '../modules/restaurants/restaurant.routes';
import restaurantAdminMutationRoutes from '../modules/restaurants/restaurant-admin.routes';
import restaurantCurrentRoutes from '../modules/restaurants/restaurant-current.routes';
import menuPublicRoutes from '../modules/menu/menu-public.routes';
import menuItemRoutes from '../modules/menu/menu-item.routes';
import menuCategoryRoutes from '../modules/menu/menu-category.routes';
import deliveryAgentRoutes from '../modules/delivery/delivery.routes';
import deliveryMeRoutes from '../modules/delivery/delivery-me.routes';
import deliveryAssignmentRoutes from '../modules/delivery/delivery-assignment.routes';
import voucherRoutes from '../modules/vouchers/voucher.routes';
import userRoutes from '../modules/users/user.routes';
import userAdminRoutes from '../modules/users/user-admin.routes';
import gameRoutes from '../modules/games/game.routes';
import gameSessionRoutes from '../modules/games/game-session.routes';
import adRoutes, { publicAdRoutes } from '../modules/ads/ad.routes';
import revenueRoutes from '../modules/revenue/revenue.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';
import analyticsAdminRoutes from '../modules/analytics/analytics-admin.routes';
import addressRoutes from '../modules/addresses/address.routes';
import uploadRoutes from '../modules/upload/upload.routes';

const router = Router();

// Public health endpoint
router.get('/', (_req, res) => {
  res.json({ message: 'JustSearch API v1', version: '1.0.0' });
});

// Auth routes (tenant-scoped)
router.use('/auth', authRoutes);

// Restaurant routes — ORDER MATTERS: specific routes (/current) must come BEFORE parameterized routes (/:id)
router.use('/restaurants', restaurantCurrentRoutes);
router.use('/restaurants', restaurantAdminRoutes);
router.use('/restaurants', restaurantAdminMutationRoutes);

// Public menu routes (tenant-scoped)
router.use('/menus', menuPublicRoutes);

// Menu management routes (authenticated)
router.use('/menu-items', menuItemRoutes);
router.use('/menu-categories', menuCategoryRoutes);

// Order routes (authenticated)
router.use('/orders', orderRoutes);

// Delivery agents (authenticated)
router.use('/delivery-agents', deliveryAgentRoutes);

// Driver self-service (authenticated, driver role)
router.use('/delivery-agents/me', deliveryMeRoutes);

// Delivery assignment lifecycle
router.use('/delivery-assignments', deliveryAssignmentRoutes);

// Vouchers / promo codes (authenticated)
router.use('/vouchers', voucherRoutes);

// Customers / users (authenticated)
router.use('/users', userRoutes);

// Addresses (authenticated customers)
router.use('/addresses', addressRoutes);

// Admin users (super-admin, platform-wide)
router.use('/admin/users', userAdminRoutes);

// Games (super-admin)
router.use('/games', gameRoutes);
router.use('/games', gameSessionRoutes);

// Advertisements — public MUST come before auth-protected routes
router.use('/advertisements/public', publicAdRoutes);
router.use('/advertisements', adRoutes);

// Revenue (super-admin)
router.use('/revenue', revenueRoutes);

// Analytics (authenticated)
router.use('/analytics', analyticsRoutes);
router.use('/analytics', analyticsAdminRoutes);

// Close-of-day routes (authenticated inside closeout router)
router.use('/close-day', orderCloseoutRoutes);

// Upload routes (authenticated)
router.use('/upload', uploadRoutes);

export default router;
