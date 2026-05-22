import { Router } from 'express';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '../../utils/jwt';
import {
  findValidRefreshToken,
  revokeRefreshToken,
  createRefreshToken,
} from './auth-refresh.services';

const router = Router();

router.post('/refresh', async (req, res, next) => {
  try {
    const body = req.body as { refreshToken?: string };
    const rawToken = typeof body.refreshToken === 'string' ? body.refreshToken : '';

    if (!rawToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    let payload;
    try {
      payload = verifyRefreshToken(rawToken);
    } catch {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const dbToken = await findValidRefreshToken(payload.sub, rawToken);
    if (!dbToken) {
      return res.status(401).json({ message: 'Refresh token revoked or expired' });
    }

    const accessToken = signAccessToken({
      id: payload.sub,
      name: payload.name,
      role: payload.role,
      restaurantId: payload.restaurantId,
      type: payload.userType,
    });

    // Re-use the same refresh token (no rotation) to avoid multi-tab logout issues.
    // The refresh token remains valid until its 7-day expiry.

    res.json({
      accessToken,
      refreshToken: rawToken,
      user: {
        id: payload.sub,
        name: payload.name,
        role: payload.role,
        type: payload.userType,
        restaurantId: payload.restaurantId,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const body = req.body as { refreshToken?: string };
    const rawToken = typeof body.refreshToken === 'string' ? body.refreshToken : '';

    if (rawToken) {
      let payload;
      try {
        payload = verifyRefreshToken(rawToken);
      } catch {
        // invalid token — nothing to revoke
      }
      if (payload) {
        const dbToken = await findValidRefreshToken(payload.sub, rawToken);
        if (dbToken) {
          await revokeRefreshToken(dbToken.id);
        }
      }
    }

    res.clearCookie('token', { path: '/' });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
