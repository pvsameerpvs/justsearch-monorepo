import { Router } from 'express';
import { signToken } from '../../utils/jwt';
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

    const token = signToken({
      userId: user.id,
      role: user.role,
      restaurantId: user.restaurantId,
      type: userType,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      token,
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
