import { Router } from 'express';
// import authRoutes from '../modules/auth/auth.routes';
// import userRoutes from '../modules/users/user.routes';
// import restaurantRoutes from '../modules/restaurants/restaurant.routes';

const router = Router();

// Routes will be registered here as they are developed
// For now, simple registration placeholders
router.get('/', (req, res) => {
  res.json({ message: 'JustSearch API v1' });
});

// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/restaurants', restaurantRoutes);

export default router;
