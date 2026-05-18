import { eq, or, and, sql } from 'drizzle-orm';
import { db } from '../../db';
import { superAdmins, users, userRestaurants } from '../../db/schema';
import { comparePassword } from '../../lib/hash';

export async function findSuperAdmin(username: string, password: string) {
  const [admin] = await db.select().from(superAdmins).where(eq(superAdmins.username, username)).limit(1);
  if (!admin) return null;
  const valid = await comparePassword(password, admin.passwordHash);
  if (!valid) return null;
  return { id: admin.id, name: admin.name, role: 'super_admin' };
}

export async function findPublicUser(
  username: string,
  password: string,
  restaurantId: string
) {
  const [user] = await db
    .select()
    .from(users)
    .where(or(eq(users.email, username), eq(users.phone, username), eq(users.username, username)))
    .limit(1);

  if (!user || !user.passwordHash) return null;

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) return null;

  const [link] = await db
    .select()
    .from(userRestaurants)
    .where(and(eq(userRestaurants.userId, user.id), eq(userRestaurants.restaurantId, restaurantId)))
    .limit(1);

  const role = link?.role || user.role;

  return {
    id: user.id,
    name: user.name,
    role,
    restaurantId,
  };
}

export async function findDeliveryAgent(
  schemaName: string,
  restaurantId: string,
  username: string,
  password: string
) {
  const [agent] = await db.execute<{
    id: string;
    name: string;
    password_hash: string;
    restaurant_id: string;
  }>(
    sql`SELECT id, name, password_hash, restaurant_id FROM ${sql.identifier(schemaName)}.${sql.identifier('delivery_agents')} WHERE restaurant_id = ${restaurantId} AND username = ${username} LIMIT 1`
  );
  if (!agent) return null;
  const valid = await comparePassword(password, agent.password_hash);
  if (!valid) return null;
  return { id: agent.id, name: agent.name, role: 'driver', restaurantId: agent.restaurant_id };
}

export async function findStaffMember(
  schemaName: string,
  restaurantId: string,
  username: string,
  password: string
) {
  const [staffMember] = await db.execute<{
    id: string;
    name: string;
    password_hash: string;
    role: string;
    restaurant_id: string;
  }>(
    sql`SELECT id, name, password_hash, role, restaurant_id FROM ${sql.identifier(schemaName)}.${sql.identifier('staff')} WHERE restaurant_id = ${restaurantId} AND username = ${username} LIMIT 1`
  );
  if (!staffMember) return null;
  const valid = await comparePassword(password, staffMember.password_hash);
  if (!valid) return null;
  return { id: staffMember.id, name: staffMember.name, role: staffMember.role, restaurantId: staffMember.restaurant_id };
}
