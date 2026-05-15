import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import otpRequestRoutes from './auth-otp-request.routes';
import otpVerifyRoutes from './auth-otp-verify.routes';
import loginRoutes from './auth-login.routes';
import meRoutes from './auth-me.routes';

const router = Router();

router.use('/otp', otpRequestRoutes);
router.use('/otp', otpVerifyRoutes);
router.use('/login', loginRoutes);
router.use('/me', authMiddleware, meRoutes);

export default router;
