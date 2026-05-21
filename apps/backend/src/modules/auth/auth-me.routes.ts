import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { superAdmins } from '../../db/schema';
import {
  getSchemaName,
  resolveStaffProfile,
  resolveDeliveryProfile,
  resolveCustomerProfile,
} from './auth-me.services';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { type, id, restaurantId } = req.auth;
    let profile: Record<string, unknown> | null = null;

    if ((type === 'customer' || type === 'staff' || type === 'delivery') && restaurantId) {
      const schemaName = req.tenant?.schemaName || await getSchemaName(restaurantId);

      if (type === 'staff') {
        profile = await resolveStaffProfile(id, restaurantId, schemaName);
      }

      if (type === 'delivery' && !profile) {
        profile = await resolveDeliveryProfile(id, restaurantId, schemaName);
      }

      if (!profile) {
        profile = await resolveCustomerProfile(id, restaurantId, type);
      }
    } else if (type === 'super_admin') {
      const [admin] = await db.select().from(superAdmins).where(eq(superAdmins.id, id)).limit(1);
      if (admin) {
        profile = { id: admin.id, name: admin.name, role: 'super_admin', type: 'super_admin' };
      }
    }

    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
});

export default router;
