import { Router } from 'express';
import otpRequestRoutes from './auth-otp-request.routes';
import otpVerifyRoutes from './auth-otp-verify.routes';
import loginRoutes from './auth-login.routes';
import meRoutes from './auth-me.routes';

const router = Router();

router.use('/otp', otpRequestRoutes);
router.use('/otp', otpVerifyRoutes);
router.use('/login', loginRoutes);
router.use('/me', meRoutes);

export default router;
