import { eq, and, gt, sql } from 'drizzle-orm';
import { db } from '../../db';
import { refreshTokens } from '../../db/schema';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

function parseDurationToMs(value: string): number {
  const match = value.trim().match(/^(\d+)\s*([dhms])$/i);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // fallback 7 days
  const num = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multipliers: Record<string, number> = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000,
  };
  return num * (multipliers[unit] ?? multipliers.d);
}

const REFRESH_TTL_MS = parseDurationToMs(process.env.JWT_REFRESH_EXPIRY || '90d');

export async function createRefreshToken(userId: string, rawToken: string) {
  const tokenHash = await bcrypt.hash(rawToken, SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

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
