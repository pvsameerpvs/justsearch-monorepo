import { Router } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../../db';
import { otpRequests, users } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { signToken } from '../../utils/jwt';
import { hashPassword } from '../../lib/hash';

const router = Router();

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function normalizeMobile(raw: string): string {
  return raw.replace(/\s+/g, '');
}

function isValidMobile(mobile: string): boolean {
  return /^\+?[0-9]{8,15}$/.test(normalizeMobile(mobile));
}

function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 60;
}

function randomOtp(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// POST /api/v1/auth/otp/request
router.post('/otp/request', async (req, res, next) => {
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

    const payload: Record<string, unknown> = { requestId };

    const debugOtpEnabled =
      process.env.DEBUG_OTP === 'true' || process.env.NODE_ENV === 'development';

    if (debugOtpEnabled) {
      payload.demoOtp = otp;
    }

    res.json(payload);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/otp/verify
router.post('/otp/verify', async (req, res, next) => {
  try {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Tenant context required' });
    }

    const body = req.body as { requestId?: string; mobile?: string; otp?: string };
    const requestId = typeof body.requestId === 'string' ? body.requestId : '';
    const mobile = normalizeMobile(typeof body.mobile === 'string' ? body.mobile : '');
    const otp = typeof body.otp === 'string' ? body.otp.trim() : '';

    if (!requestId) {
      return res.status(400).json({ error: 'Missing requestId' });
    }
    if (!mobile) {
      return res.status(400).json({ error: 'Missing mobile' });
    }
    if (!/^\d{4}$/.test(otp)) {
      return res.status(400).json({ error: 'Invalid OTP format' });
    }

    const [record] = await db
      .select()
      .from(otpRequests)
      .where(
        and(
          eq(otpRequests.restaurantId, req.tenant.id),
          eq(otpRequests.requestId, requestId),
          eq(otpRequests.mobile, mobile)
        )
      )
      .limit(1);

    if (!record) {
      return res.status(400).json({ error: 'OTP request not found' });
    }

    if (new Date() > record.expiresAt) {
      await db.delete(otpRequests).where(eq(otpRequests.id, record.id));
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      await db.delete(otpRequests).where(eq(otpRequests.id, record.id));
      return res.status(429).json({ error: 'Too many attempts' });
    }

    await db
      .update(otpRequests)
      .set({ attempts: record.attempts + 1 })
      .where(eq(otpRequests.id, record.id));

    if (record.otp !== otp) {
      return res.status(400).json({ error: 'Incorrect OTP' });
    }

    await db.delete(otpRequests).where(eq(otpRequests.id, record.id));

    // Find or create user
    const [existingUser] = await db
      .select()
      .from(users)
      .where(
        and(eq(users.restaurantId, req.tenant.id), eq(users.phone, mobile))
      )
      .limit(1);

    let user = existingUser;
    if (!user) {
      const [newUser] = await db
        .insert(users)
        .values({
          restaurantId: req.tenant.id,
          phone: mobile,
          name: record.name,
          role: 'customer',
          isActive: true,
        })
        .returning();
      user = newUser;
    }

    const token = signToken({
      userId: user.id,
      role: user.role,
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
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/login (staff / delivery / super-admin)
router.post('/login', async (req, res, next) => {
  try {
    const body = req.body as { username?: string; password?: string; type?: string };
    const username = typeof body.username === 'string' ? body.username : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const type = typeof body.type === 'string' ? body.type : 'staff';

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // This is a simplified login handler.
    // In production, lookup the correct table based on type:
    // - 'super_admin' → public.super_admins
    // - 'staff' → tenant staff table
    // - 'delivery' → tenant delivery_agents table

    res.status(501).json({ error: 'Login not fully implemented yet' });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/auth/me
router.get('/me', async (req, res, next) => {
  try {
    // Auth middleware must run before this route
    if (!req.auth) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.auth.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      restaurantId: user.restaurantId,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
