import { randomUUID } from 'crypto';
import { Router } from 'express';
import { eq, sql } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';
import { otpRequestLimiter } from '../../middleware/rate-limit.middleware';
import { normalizeMobile, isValidMobile, isValidName, randomOtp, OTP_TTL_MS } from './auth.utils';
import { t } from '../../lib/tenant-sql';

const router = Router();

router.post('/request', otpRequestLimiter, async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const body = req.body as { name?: string; mobile?: string };
    const rawName = typeof body.name === 'string' ? body.name : '';
    const mobile = normalizeMobile(typeof body.mobile === 'string' ? body.mobile : '');

    if (!isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number' });
    }

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.phone, mobile))
      .limit(1);

    const flow = existingUser ? 'signin' : 'signup';

    // For signup flow: if no name provided, return flow hint so frontend can auto-switch to signup tab
    // If name is provided but invalid, return 400
    if (flow === 'signup' && rawName.trim() !== '' && !isValidName(rawName)) {
      return res.status(400).json({ error: 'Invalid name' });
    }

    const name = flow === 'signin' && existingUser ? existingUser.name : rawName.trim();

    const requestId = randomUUID();
    const otp = randomOtp();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + OTP_TTL_MS);

    await db.execute(sql`
      INSERT INTO ${t(req.tenant.schemaName, 'otp_requests')} (
        restaurant_id, request_id, name, mobile, otp, attempts, created_at, expires_at
      ) VALUES (
        ${req.tenant.id}, ${requestId}, ${name}, ${mobile}, ${otp}, 0, ${now.toISOString()}, ${expiresAt.toISOString()}
      )
    `);

    const showDemoOtp = process.env.NODE_ENV !== 'production' || process.env.DEBUG_OTP === 'true';
    res.json({ requestId, flow, ...(showDemoOtp ? { demoOtp: otp } : {}) });
  } catch (error) {
    next(error);
  }
});

export default router;
