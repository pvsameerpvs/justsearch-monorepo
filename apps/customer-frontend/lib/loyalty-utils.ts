/**
 * Shared Loyalty & Profile Utilities
 * Standardizes tiers, levels, and progress across the platform.
 */

export type LoyaltyTier = 'ELITE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export const LOYALTY_CONFIG = {
  TIERS: {
    PLATINUM: { min: 2000, label: 'PLATINUM' },
    GOLD: { min: 1200, label: 'GOLD' },
    SILVER: { min: 600, label: 'SILVER' },
    ELITE: { min: 0, label: 'ELITE' },
  },
  XP_PER_LEVEL: 10, // rounds per level
};

export function getLoyaltyTier(points: number): LoyaltyTier {
  if (points >= LOYALTY_CONFIG.TIERS.PLATINUM.min) return 'PLATINUM';
  if (points >= LOYALTY_CONFIG.TIERS.GOLD.min) return 'GOLD';
  if (points >= LOYALTY_CONFIG.TIERS.SILVER.min) return 'SILVER';
  return 'ELITE';
}

export function calculatePlayerLevel(roundsPlayed: number) {
  const level = Math.floor(roundsPlayed / LOYALTY_CONFIG.XP_PER_LEVEL) + 1;
  const currentLevelXP = roundsPlayed % LOYALTY_CONFIG.XP_PER_LEVEL;
  const progress = (currentLevelXP / LOYALTY_CONFIG.XP_PER_LEVEL) * 100;
  const neededXP = LOYALTY_CONFIG.XP_PER_LEVEL - currentLevelXP;

  return {
    level,
    progress,
    neededXP,
    totalXP: roundsPlayed,
    nextLevelXP: LOYALTY_CONFIG.XP_PER_LEVEL
  };
}

/**
 * Generates a stable player ID based on a value (like mobile or name)
 * or returns a consistent ID for the session.
 */
export function getStablePlayerId(seed?: string) {
  if (!seed) return '7342'; // Fallback
  // Simple hash for demo purposes
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 9000 + 1000).toString();
}
