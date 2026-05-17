import { randomUUID } from 'crypto';
import { Router } from 'express';
import { db } from '../../db';
import { otpRequests } from '../../db/schema';
import { otpRequestLimiter } from '../../middleware/rate-limit.middleware';
import { normalizeMobile, isValidMobile, isValidName, randomOtp, OTP_TTL_MS } from './auth.utils';

const router = Router();

router.post('/request', otpRequestLimiter, async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const body = req.body as { name?: string; mobile?: string };
    const name = typeof body.name === 'string' ? body.name : '';
    const mobile = normalizeMobile(typeof body.mobile === 'string' ? body.mobile : '');

    if (!isValidName(name)) {
      return res.status(400).json({ error: 'Invalid name' });
    }
    if (!isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number' });
    }

    const requestId = randomUUID();
    const otp = randomOtp();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + OTP_TTL_MS);

    await db.insert(otpRequests).values({
      restaurantId: req.tenant.id,
      requestId,
      name: name.trim(),
      mobile,
      otp,
      attempts: 0,
      createdAt: now,
      expiresAt,
    });

    const isDev = process.env.NODE_ENV !== 'production';
    res.json({ requestId, ...(isDev ? { demoOtp: otp } : {}) });
  } catch (error) {
    next(error);
  }
});

export default router;
