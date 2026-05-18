import { eq, and } from 'drizzle-orm';
import { db } from '../../db';
import { otpRequests, users, userRestaurants } from '../../db/schema';
import { OTP_TTL_MS, MAX_ATTEMPTS } from './auth.utils';

export async function validateOtpRequest(
  restaurantId: string,
  requestId: string,
  mobile: string,
  otp: string
) {
  const [record] = await db
    .select()
    .from(otpRequests)
    .where(
      and(
        eq(otpRequests.restaurantId, restaurantId),
        eq(otpRequests.requestId, requestId),
        eq(otpRequests.mobile, mobile)
      )
    )
    .limit(1);

  if (!record) return { ok: false, error: 'OTP request not found' };

  if (new Date() > record.expiresAt) {
    await db.delete(otpRequests).where(eq(otpRequests.id, record.id));
    return { ok: false, error: 'OTP expired' };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await db.delete(otpRequests).where(eq(otpRequests.id, record.id));
    return { ok: false, error: 'Too many attempts' };
  }

  await db
    .update(otpRequests)
    .set({ attempts: record.attempts + 1 })
    .where(eq(otpRequests.id, record.id));

  if (record.otp !== otp) {
    return { ok: false, error: 'Incorrect OTP' };
  }

  await db.delete(otpRequests).where(eq(otpRequests.id, record.id));

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.phone, mobile))
    .limit(1);

  let user = existingUser;
  if (!user) {
    const [newUser] = await db
      .insert(users)
      .values({ phone: mobile, name: record.name, role: 'customer', isActive: true })
      .returning();
    user = newUser;
  }

  if (!user) {
    return { ok: false, error: 'User creation failed' };
  }

  const [existingLink] = await db
    .select()
    .from(userRestaurants)
    .where(and(eq(userRestaurants.userId, user.id), eq(userRestaurants.restaurantId, restaurantId)))
    .limit(1);

  let userRole = user.role;
  if (!existingLink) {
    await db
      .insert(userRestaurants)
      .values({ userId: user.id, restaurantId, role: user.role, permissions: {} });
  } else {
    userRole = existingLink.role;
  }

  return { ok: true, user, userRole };
}
