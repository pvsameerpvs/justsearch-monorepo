import { eq, and, sql } from 'drizzle-orm';
import { db, type Database } from '../../db';
import { users, userRestaurants } from '../../db/schema';
import { MAX_ATTEMPTS } from './auth.utils';
import { t } from '../../lib/tenant-sql';

export async function validateOtpRequest(
  schemaName: string,
  restaurantId: string,
  requestId: string,
  mobile: string,
  otp: string,
  dbInstance: Database = db
) {
  const recordRows = await dbInstance.execute<Record<string, unknown>>(sql`
    SELECT * FROM ${t(schemaName, 'otp_requests')}
    WHERE restaurant_id = ${restaurantId} AND request_id = ${requestId} AND mobile = ${mobile}
    LIMIT 1
  `);
  const record = recordRows[0];

  if (!record) return { ok: false, error: 'OTP request not found' };

  if (new Date() > (record.expires_at as Date)) {
    await dbInstance.execute(sql`
      DELETE FROM ${t(schemaName, 'otp_requests')} WHERE id = ${record.id}
    `);
    return { ok: false, error: 'OTP expired' };
  }

  if ((record.attempts as number) >= MAX_ATTEMPTS) {
    await dbInstance.execute(sql`
      DELETE FROM ${t(schemaName, 'otp_requests')} WHERE id = ${record.id}
    `);
    return { ok: false, error: 'Too many attempts' };
  }

  await dbInstance.execute(sql`
    UPDATE ${t(schemaName, 'otp_requests')}
    SET attempts = ${(record.attempts as number) + 1}
    WHERE id = ${record.id}
  `);

  if ((record.otp as string) !== otp) {
    return { ok: false, error: 'Incorrect OTP' };
  }

  await dbInstance.execute(sql`
    DELETE FROM ${t(schemaName, 'otp_requests')} WHERE id = ${record.id}
  `);

  const normalizedMobile = mobile.replace(/^\+/, '');

  const [existingUser] = await dbInstance
    .select()
    .from(users)
    .where(
      sql`REPLACE(${users.phone}, '+', '') = ${normalizedMobile}`
    )
    .limit(1);

  let user = existingUser;
  let isNewLink = false;

  if (!user) {
    const [newUser] = await dbInstance
      .insert(users)
      .values({ phone: mobile, name: record.name as string, role: 'customer', isActive: true })
      .returning();
    user = newUser;
    isNewLink = true;
  }

  if (!user) {
    return { ok: false, error: 'User creation failed' };
  }

  const [existingLink] = await dbInstance
    .select()
    .from(userRestaurants)
    .where(and(eq(userRestaurants.userId, user.id), eq(userRestaurants.restaurantId, restaurantId)))
    .limit(1);

  let userRole = user.role;
  if (!existingLink) {
    await dbInstance
      .insert(userRestaurants)
      .values({ userId: user.id, restaurantId, role: user.role, permissions: {} });
    isNewLink = true;
  } else {
    userRole = existingLink.role;
  }

  return { ok: true, user, userRole, isNewLink };
}
