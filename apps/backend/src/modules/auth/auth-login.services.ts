import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import { superAdmins, staff, deliveryAgents } from '../../db/schema';
import { comparePassword } from '../../lib/hash';

export async function findSuperAdmin(username: string, password: string) {
  const [admin] = await db.select().from(superAdmins).where(eq(superAdmins.username, username)).limit(1);
  if (!admin) return null;
  const valid = await comparePassword(password, admin.passwordHash);
  if (!valid) return null;
  return { id: admin.id, name: admin.name, role: 'super_admin' };
}

export async function findDeliveryAgent(restaurantId: string, username: string, password: string) {
  const [agent] = await db
    .select()
    .from(deliveryAgents)
    .where(and(eq(deliveryAgents.restaurantId, restaurantId), eq(deliveryAgents.username, username)))
    .limit(1);
  if (!agent) return null;
  const valid = await comparePassword(password, agent.passwordHash);
  if (!valid) return null;
  return { id: agent.id, name: agent.name, role: 'driver', restaurantId };
}

export async function findStaffMember(restaurantId: string, username: string, password: string) {
  const [staffMember] = await db
    .select()
    .from(staff)
    .where(and(eq(staff.restaurantId, restaurantId), eq(staff.username, username)))
    .limit(1);
  if (!staffMember) return null;
  const valid = await comparePassword(password, staffMember.passwordHash);
  if (!valid) return null;
  return { id: staffMember.id, name: staffMember.name, role: staffMember.role, restaurantId };
}
