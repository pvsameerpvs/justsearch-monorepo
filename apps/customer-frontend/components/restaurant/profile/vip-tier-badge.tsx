"use client";

import { Crown, Star } from 'lucide-react';
import type { VipTier } from './use-vip-tier';

const TIER_ICONS: Record<VipTier, React.ReactNode> = {
  bronze: <Star className="h-5 w-5" />,
  silver: <Star className="h-5 w-5" />,
  gold: <Crown className="h-5 w-5" />,
  platinum: <Crown className="h-5 w-5" />,
};

interface VipTierBadgeProps {
  tier: VipTier;
  size?: 'md' | 'lg';
  color: string;
}

export function VipTierBadge({ tier, size = 'md', color }: VipTierBadgeProps) {
  return (
    <div
      className={`flex items-center justify-center text-white ${size === 'lg' ? 'h-12 w-12 rounded-xl' : 'h-10 w-10 rounded-lg'}`}
      style={{ backgroundColor: color }}
    >
      {TIER_ICONS[tier]}
    </div>
  );
}
