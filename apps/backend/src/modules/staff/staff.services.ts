import { sql } from 'drizzle-orm';
import { db, client } from '../../db';

export async function checkCanModifyStaff(
  schemaName: string,
  staffId: string,
  restaurantId: string,
  userRole: string | undefined
): Promise<{ allowed: boolean; message?: string }> {
  if (userRole === 'owner') return { allowed: true };

  const targetRows = await db.execute<Record<string, unknown>>(
    sql`SELECT role FROM ${sql.identifier(schemaName)}.${sql.identifier('staff')} WHERE id = ${staffId} AND restaurant_id = ${restaurantId} LIMIT 1`
  );
  const targetRole = targetRows[0]?.role as string | undefined;

  if (targetRole === 'owner') {
    return { allowed: false, message: 'Only owner can modify owner accounts' };
  }

  return { allowed: true };
}

export async function checkCanDeleteStaff(
  schemaName: string,
  staffId: string,
  restaurantId: string,
  userRole: string | undefined,
  currentUserId: string | undefined
): Promise<{ allowed: boolean; message?: string }> {
  const targetRows = await db.execute<Record<string, unknown>>(
    sql`SELECT role, id FROM ${sql.identifier(schemaName)}.${sql.identifier('staff')} WHERE id = ${staffId} AND restaurant_id = ${restaurantId} LIMIT 1`
  );
  const targetRecord = targetRows[0];

  if (!targetRecord) {
    return { allowed: false, message: 'Staff member not found' };
  }

  const targetRole = targetRecord.role as string;
  const targetId = targetRecord.id as string;

  if (targetRole === 'owner' && userRole !== 'owner') {
    return { allowed: false, message: 'Only owner can delete owner accounts' };
  }

  if (targetId === currentUserId) {
    return { allowed: false, message: 'You cannot delete your own account' };
  }

  return { allowed: true };
}

export async function updateStaffMember(
  schemaName: string,
  staffId: string,
  restaurantId: string,
  updates: Record<string, string | boolean>
): Promise<Record<string, unknown> | null> {
  const setFields: string[] = ['updated_at = NOW()'];
  const params: (string | boolean | null)[] = [];
  let paramIndex = 0;

  for (const [key, value] of Object.entries(updates)) {
    setFields.push(`${key} = $${++paramIndex}`);
    params.push(value);
  }

  params.push(staffId, restaurantId);

  const rawQuery = `UPDATE "${schemaName}"."staff" SET ${setFields.join(', ')} WHERE id = $${paramIndex + 1} AND restaurant_id = $${paramIndex + 2} RETURNING id, restaurant_id, name, username, role, permissions, is_active, created_at, updated_at`;
  const [updated] = await client.unsafe(rawQuery, params) as Record<string, unknown>[];

  return updated || null;
}
