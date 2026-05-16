"use client";

import { useVipTier, VIP_TIER_CONFIG } from './use-vip-tier';
import { VipTierBadge } from './vip-tier-badge';
import { VipTierProgress } from './vip-tier-progress';

export function VipTierCard() {
  const { tier, points, nextTier, pointsToNextTier, progressPercent, config } = useVipTier();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <VipTierBadge tier={tier} size="lg" color={config.color} />
        <div>
          <h3 className="text-lg font-bold text-slate-900">{config.name} Member</h3>
          <p className="text-sm text-slate-500">{points.toLocaleString()} points</p>
        </div>
      </div>

      {nextTier && (
        <VipTierProgress
          nextTierName={VIP_TIER_CONFIG[nextTier].name}
          pointsToNextTier={pointsToNextTier}
          progressPercent={progressPercent}
          color={config.color}
        />
      )}
    </div>
  );
}
