import { Router } from 'express';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../db';
import { users, userRestaurants, superAdmins, restaurants, loyaltyPoints } from '../../db/schema';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { type, id, name, restaurantId } = req.auth;
    let profile: Record<string, unknown> | null = null;

    if ((type === 'customer' || type === 'staff' || type === 'delivery') && restaurantId) {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (user) {
        const [link] = await db
          .select()
          .from(userRestaurants)
          .where(and(eq(userRestaurants.userId, id), eq(userRestaurants.restaurantId, restaurantId)))
          .limit(1);

        // Fetch loyalty points for customers
        let points = 0;
        if (type === 'customer') {
          const [lp] = await db
            .select()
            .from(loyaltyPoints)
            .where(eq(loyaltyPoints.userId, id))
            .limit(1);
          points = lp?.points ?? 0;
        }

        profile = {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: link?.role || user.role,
          restaurantId,
          type,
          ...(type === 'customer' && { points }),
        };
      }

      if (!profile && type === 'staff') {
        const schemaName = req.tenant?.schemaName || await getSchemaName(restaurantId);
        const [staffMember] = await db.execute<{
          id: string;
          name: string;
          role: string;
          restaurant_id: string;
        }>(
          sql`SELECT id, name, role, restaurant_id FROM ${sql.identifier(schemaName)}.${sql.identifier('staff')} WHERE id = ${id} AND restaurant_id = ${restaurantId} LIMIT 1`
        );
        if (staffMember) {
          profile = { id: staffMember.id, name: staffMember.name, role: staffMember.role, type: 'staff', restaurantId: staffMember.restaurant_id };
        }
      }

      if (!profile && type === 'delivery') {
        const schemaName = req.tenant?.schemaName || await getSchemaName(restaurantId);
        const [agent] = await db.execute<{
          id: string;
          name: string;
          restaurant_id: string;
        }>(
          sql`SELECT id, name, restaurant_id FROM ${sql.identifier(schemaName)}.${sql.identifier('delivery_agents')} WHERE id = ${id} AND restaurant_id = ${restaurantId} LIMIT 1`
        );
        if (agent) {
          profile = { id: agent.id, name: agent.name, role: 'driver', type: 'delivery', restaurantId: agent.restaurant_id };
        }
      }
    } else if (type === 'super_admin') {
      const [admin] = await db
        .select()
        .from(superAdmins)
        .where(eq(superAdmins.id, id))
        .limit(1);
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

async function getSchemaName(restaurantId: string): Promise<string> {
  const [restaurant] = await db
    .select({ schemaName: restaurants.schemaName })
    .from(restaurants)
    .where(eq(restaurants.id, restaurantId))
    .limit(1);
  return restaurant?.schemaName || 'public';
}

export default router;
