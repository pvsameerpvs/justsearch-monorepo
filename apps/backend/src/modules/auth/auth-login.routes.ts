import { Router } from 'express';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';
import { createRefreshToken } from './auth-refresh.services';
import { resolveUser } from './auth-login.utils';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const body = req.body as { username?: string; password?: string; type?: string };
    const username = typeof body.username === 'string' ? body.username : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const type = typeof body.type === 'string' ? body.type : 'staff';

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const loginResult = await resolveUser(username, password, type, req.tenant);
    const user = loginResult.user;
    const userType = loginResult.userType;

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = signAccessToken({
      id: user.id,
      name: user.name,
      role: user.role,
      restaurantId: user.restaurantId,
      type: userType,
    });
    const refreshToken = signRefreshToken(user.id, user.name, user.role, userType, user.restaurantId);
    await createRefreshToken(user.id, refreshToken);

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours (matches JWT_ACCESS_EXPIRY)
    });

    res.json({
      token: accessToken, // legacy field for backward compatibility
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        type: userType,
        restaurantId: user.restaurantId,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Tenant context required') {
      return res.status(400).json({ message: 'Restaurant subdomain required. Please provide a valid restaurant slug.' });
    }
    next(error);
  }
});

export default router;
