import { Router } from 'express';
import { signToken } from '../../utils/jwt';
import { findSuperAdmin, findDeliveryAgent, findStaffMember } from './auth-login.services';
import { MOCK_AUTH_ENABLED, findMockUser } from '../../lib/mock-auth';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const body = req.body as { username?: string; password?: string; type?: string };
    const username = typeof body.username === 'string' ? body.username : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const type = typeof body.type === 'string' ? body.type : 'staff';

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    let user: { id: string; name: string; role: string; restaurantId?: string } | null = null;
    let userType: 'staff' | 'delivery' | 'super_admin' = 'staff';

    if (MOCK_AUTH_ENABLED) {
      const mockUser = findMockUser(username, password, type);
      if (mockUser) {
        user = {
          id: mockUser.id,
          name: mockUser.name,
          role: mockUser.role,
          restaurantId: mockUser.restaurantId,
        };
        userType = mockUser.type;
      }
    } else {
      if (type === 'super_admin') {
        user = await findSuperAdmin(username, password);
        userType = 'super_admin';
      } else if (type === 'delivery') {
        if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });
        user = await findDeliveryAgent(req.tenant.id, username, password);
        userType = 'delivery';
      } else {
        if (!req.tenant) return res.status(400).json({ error: 'Tenant context required' });
        user = await findStaffMember(req.tenant.id, username, password);
        userType = 'staff';
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
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
    next(error);
  }
});

export default router;
