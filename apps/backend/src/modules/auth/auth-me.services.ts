import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../db';
import { users, userRestaurants, restaurants, loyaltyPoints } from '../../db/schema';

export async function getSchemaName(restaurantId: string): Promise<string> {
  const [restaurant] = await db
    .select({ schemaName: restaurants.schemaName })
    .from(restaurants)
    .where(eq(restaurants.id, restaurantId))
    .limit(1);
  return restaurant?.schemaName || 'public';
}

export async function resolveStaffProfile(id: string, restaurantId: string, schemaName: string) {
  const [staffMember] = await db.execute<{
    id: string;
    name: string;
    role: string;
    restaurant_id: string;
  }>(
    sql`SELECT id, name, role, restaurant_id FROM ${sql.identifier(schemaName)}.${sql.identifier('staff')} WHERE id = ${id} AND restaurant_id = ${restaurantId} LIMIT 1`
  );
  if (!staffMember) return null;
  return {
    id: staffMember.id,
    name: staffMember.name,
    role: staffMember.role,
    type: 'staff',
    restaurantId: staffMember.restaurant_id,
  };
}

export async function resolveDeliveryProfile(id: string, restaurantId: string, schemaName: string) {
  const [agent] = await db.execute<{
    id: string;
    name: string;
    restaurant_id: string;
  }>(
    sql`SELECT id, name, restaurant_id FROM ${sql.identifier(schemaName)}.${sql.identifier('delivery_agents')} WHERE id = ${id} AND restaurant_id = ${restaurantId} LIMIT 1`
  );
  if (!agent) return null;
  return {
    id: agent.id,
    name: agent.name,
    role: 'driver',
    type: 'delivery',
    restaurantId: agent.restaurant_id,
  };
}

export async function resolveCustomerProfile(id: string, restaurantId: string, type: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user) return null;

  const [link] = await db
    .select()
    .from(userRestaurants)
    .where(and(eq(userRestaurants.userId, id), eq(userRestaurants.restaurantId, restaurantId)))
    .limit(1);

  let points = 0;
  if (type === 'customer') {
    const [lp] = await db.select().from(loyaltyPoints).where(eq(loyaltyPoints.userId, id)).limit(1);
    points = lp?.points ?? 0;
  }

  return {
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
