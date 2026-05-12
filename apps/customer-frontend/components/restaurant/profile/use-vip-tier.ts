"use client";

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'justsearch:vipTiers';

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

function readVipData(): { tier: VipTier; points: number } {
  if (typeof window === 'undefined') return { tier: 'bronze', points: 0 };
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return { tier: 'bronze', points: 0 };
    const parsed = JSON.parse(stored);
    return { tier: parsed.tier ?? 'bronze', points: parsed.points ?? 0 };
  } catch {
    return { tier: 'bronze', points: 0 };
  }
}

function writeVipData(data: { tier: VipTier; points: number }) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function resolveTierFromPoints(points: number): VipTier {
  if (points >= VIP_TIER_CONFIG.platinum.minPoints) return 'platinum';
  if (points >= VIP_TIER_CONFIG.gold.minPoints) return 'gold';
  if (points >= VIP_TIER_CONFIG.silver.minPoints) return 'silver';
  return 'bronze';
}

export function useVipTier() {
  const [tier, setTierState] = useState<VipTier>('bronze');
  const [points, setPointsState] = useState(0);

  useEffect(() => {
    const data = readVipData();
    setTierState(data.tier);
    setPointsState(data.points);
  }, []);

  const setTier = useCallback((newTier: VipTier) => {
    setTierState(newTier);
    setPointsState((current) => {
      const nextPoints = Math.max(current, VIP_TIER_CONFIG[newTier].minPoints);
      writeVipData({ tier: newTier, points: nextPoints });
      return nextPoints;
    });
  }, []);

  const addPoints = useCallback((delta: number) => {
    setPointsState((current) => {
      const next = current + Math.max(0, delta);
      const nextTier = resolveTierFromPoints(next);
      setTierState(nextTier);
      writeVipData({ tier: nextTier, points: next });
      return next;
    });
  }, []);

  const nextTier = (() => {
    const currentIndex = VIP_TIERS.indexOf(tier);
    if (currentIndex >= VIP_TIERS.length - 1) return null;
    return VIP_TIERS[currentIndex + 1];
  })();

  const pointsToNextTier = (() => {
    if (!nextTier) return 0;
    return Math.max(0, VIP_TIER_CONFIG[nextTier].minPoints - points);
  })();

  const progressPercent = (() => {
    if (!nextTier) return 100;
    const currentMin = VIP_TIER_CONFIG[tier].minPoints;
    const nextMin = VIP_TIER_CONFIG[nextTier].minPoints;
    const range = nextMin - currentMin;
    if (range <= 0) return 100;
    return Math.min(100, Math.floor(((points - currentMin) / range) * 100));
  })();

  return {
    tier,
    points,
    setTier,
    addPoints,
    nextTier,
    pointsToNextTier,
    progressPercent,
    config: VIP_TIER_CONFIG[tier],
  };
}
