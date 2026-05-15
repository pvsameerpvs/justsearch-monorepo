import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import orderRoutes from '../modules/orders/order.routes';
import orderCloseoutRoutes from '../modules/orders/order-closeout.routes';
import restaurantAdminRoutes from '../modules/restaurants/restaurant.routes';
import restaurantCurrentRoutes from '../modules/restaurants/restaurant-current.routes';
import menuPublicRoutes from '../modules/menus/menu-public.routes';

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

// Order routes (authenticated)
router.use('/orders', orderRoutes);

// Close-of-day routes (authenticated inside closeout router)
router.use('/close-day', orderCloseoutRoutes);

export default router;
