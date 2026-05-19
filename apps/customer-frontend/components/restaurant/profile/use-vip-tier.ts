"use client";

import { useMemo } from 'react';
import { useLoyaltyPoints } from '../use-loyalty-points';

export type VipTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export const VIP_TIER_CONFIG: Record<
  VipTier,
  { name: string; minPoints: number; color: string; benefits: string[] }
> = {
  bronze: {
    name: 'Bronze',
    minPoints: 0,
    color: '#cd7f32',
    benefits: ['5% discount on orders', 'Birthday reward'],
  },
  silver: {
    name: 'Silver',
    minPoints: 500,
    color: '#c0c0c0',
    benefits: ['10% discount on orders', 'Free delivery', 'Priority support'],
  },
  gold: {
    name: 'Gold',
    minPoints: 2000,
    color: '#ffd700',
    benefits: ['15% discount on orders', 'Free delivery', 'Early access to events', 'Double game points'],
  },
  platinum: {
    name: 'Platinum',
    minPoints: 5000,
    color: '#e5e4e2',
    benefits: ['20% discount on orders', 'Free delivery', 'VIP event access', 'Triple game points', 'Personal concierge'],
  },
};

export const VIP_TIERS: VipTier[] = ['bronze', 'silver', 'gold', 'platinum'];

function resolveTierFromPoints(points: number): VipTier {
  if (points >= VIP_TIER_CONFIG.platinum.minPoints) return 'platinum';
  if (points >= VIP_TIER_CONFIG.gold.minPoints) return 'gold';
  if (points >= VIP_TIER_CONFIG.silver.minPoints) return 'silver';
  return 'bronze';
}

export function useVipTier(externalPoints?: number) {
  const { points: loyaltyPoints } = useLoyaltyPoints();
  const points = externalPoints ?? loyaltyPoints;

  const tier = useMemo(() => resolveTierFromPoints(points), [points]);

  const nextTier = useMemo(() => {
    const currentIndex = VIP_TIERS.indexOf(tier);
    if (currentIndex >= VIP_TIERS.length - 1) return null;
    return VIP_TIERS[currentIndex + 1];
  }, [tier]);

  const pointsToNextTier = useMemo(() => {
    if (!nextTier) return 0;
    return Math.max(0, VIP_TIER_CONFIG[nextTier].minPoints - points);
  }, [nextTier, points]);

  const progressPercent = useMemo(() => {
    if (!nextTier) return 100;
    const currentMin = VIP_TIER_CONFIG[tier].minPoints;
    const nextMin = VIP_TIER_CONFIG[nextTier].minPoints;
    const range = nextMin - currentMin;
    if (range <= 0) return 100;
    return Math.min(100, Math.floor(((points - currentMin) / range) * 100));
  }, [tier, nextTier, points]);

  return {
    tier,
    points,
    nextTier,
    pointsToNextTier,
    progressPercent,
    config: VIP_TIER_CONFIG[tier],
  };
}
