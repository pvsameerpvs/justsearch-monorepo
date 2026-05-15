import { Router } from 'express';
import { db } from '../../db';
import { users, superAdmins, staff, deliveryAgents } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { MOCK_AUTH_ENABLED, MOCK_USERS } from '../../lib/mock-auth';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { type, userId, restaurantId } = req.auth;
    let profile: Record<string, unknown> | null = null;

    if (MOCK_AUTH_ENABLED) {
      const mockUser = MOCK_USERS.find((u) => u.id === userId && u.type === type);
      if (mockUser) {
        profile = {
          id: mockUser.id,
          name: mockUser.name,
          role: mockUser.role,
          type: mockUser.type,
          restaurantId: mockUser.restaurantId,
        };
      }
    } else {
      if (type === 'customer') {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);
        if (user) {
          profile = { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, restaurantId: user.restaurantId };
        }
      } else if (type === 'super_admin') {
        const [admin] = await db
          .select()
          .from(superAdmins)
          .where(eq(superAdmins.id, userId))
          .limit(1);
        if (admin) {
          profile = { id: admin.id, name: admin.name, role: 'super_admin', type: 'super_admin' };
        }
      } else if (type === 'staff' && restaurantId) {
        const [staffMember] = await db
          .select()
          .from(staff)
          .where(and(eq(staff.id, userId), eq(staff.restaurantId, restaurantId)))
          .limit(1);
        if (staffMember) {
          profile = { id: staffMember.id, name: staffMember.name, role: staffMember.role, type: 'staff', restaurantId: staffMember.restaurantId };
        }
      } else if (type === 'delivery' && restaurantId) {
        const [agent] = await db
          .select()
          .from(deliveryAgents)
          .where(and(eq(deliveryAgents.id, userId), eq(deliveryAgents.restaurantId, restaurantId)))
          .limit(1);
        if (agent) {
          profile = { id: agent.id, name: agent.name, role: 'driver', type: 'delivery', restaurantId: agent.restaurantId };
        }
      }
    }

    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
});

export default router;
