import { eq, and, gt, sql } from 'drizzle-orm';
import { db } from '../../db';
import { refreshTokens } from '../../db/schema';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function createRefreshToken(userId: string, rawToken: string) {
  const tokenHash = await bcrypt.hash(rawToken, SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const [record] = await db
    .insert(refreshTokens)
    .values({ userId, tokenHash, expiresAt })
    .returning();

  return record;
}

export async function findValidRefreshToken(userId: string, rawToken: string) {
  const candidates = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.userId, userId),
        gt(refreshTokens.expiresAt, sql`now()`),
        eq(refreshTokens.revoked, false)
      )
    );

  for (const candidate of candidates) {
    const match = await bcrypt.compare(rawToken, candidate.tokenHash);
    if (match) return candidate;
  }

  return null;
}

export async function revokeRefreshToken(tokenId: string) {
  await db
    .update(refreshTokens)
    .set({ revoked: true })
    .where(eq(refreshTokens.id, tokenId));
}

export async function revokeAllUserTokens(userId: string) {
  await db
    .update(refreshTokens)
    .set({ revoked: true })
    .where(eq(refreshTokens.userId, userId));
}

export async function markTokenUsed(tokenId: string) {
  await db
    .update(refreshTokens)
    .set({ usedAt: new Date() })
    .where(eq(refreshTokens.id, tokenId));
}
