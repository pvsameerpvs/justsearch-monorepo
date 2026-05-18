import { Router } from 'express';
import { signToken } from '../../utils/jwt';
import { otpVerifyLimiter } from '../../middleware/rate-limit.middleware';
import { normalizeMobile } from './auth.utils';
import { validateOtpRequest } from './auth-otp.services';

const router = Router();

router.post('/verify', otpVerifyLimiter, async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const body = req.body as { requestId?: string; mobile?: string; otp?: string };
    const requestId = typeof body.requestId === 'string' ? body.requestId : '';
    const mobile = normalizeMobile(typeof body.mobile === 'string' ? body.mobile : '');
    const otp = typeof body.otp === 'string' ? body.otp.trim() : '';

    if (!requestId) return res.status(400).json({ error: 'Missing requestId' });
    if (!mobile) return res.status(400).json({ error: 'Missing mobile' });
    if (!/^\d{4}$/.test(otp)) return res.status(400).json({ error: 'Invalid OTP format' });

    const result = await validateOtpRequest(req.tenant.id, requestId, mobile, otp);

    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }

    if (!result.user) {
      return res.status(500).json({ error: 'User creation failed' });
    }

    const token = signToken({
      id: result.user.id,
      name: result.user.name,
      role: result.userRole,
      restaurantId: req.tenant.id,
      type: 'customer',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      verified: true,
      token,
      isNewLink: result.isNewLink,
      user: { id: result.user.id, name: result.user.name, phone: result.user.phone, role: result.userRole },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
