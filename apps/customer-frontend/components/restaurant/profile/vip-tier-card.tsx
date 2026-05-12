"use client";

import { motion } from 'framer-motion';
import { Crown, Star, Gift, Truck, Calendar, Sparkles, Headphones } from 'lucide-react';
import { useVipTier, VIP_TIER_CONFIG, VIP_TIERS } from './use-vip-tier';
import type { VipTier } from './use-vip-tier';

const TIER_ICONS: Record<VipTier, React.ReactNode> = {
  bronze: <Star className="h-5 w-5" />,
  silver: <Star className="h-5 w-5" />,
  gold: <Crown className="h-5 w-5" />,
  platinum: <Crown className="h-5 w-5" />,
};

const BENEFIT_ICONS: Record<string, React.ReactNode> = {
  'discount': <Gift className="h-4 w-4" />,
  'delivery': <Truck className="h-4 w-4" />,
  'event': <Calendar className="h-4 w-4" />,
  'points': <Sparkles className="h-4 w-4" />,
  'concierge': <Headphones className="h-4 w-4" />,
};

function getBenefitIcon(benefit: string): React.ReactNode {
  if (benefit.includes('discount')) return BENEFIT_ICONS.discount;
  if (benefit.includes('delivery')) return BENEFIT_ICONS.delivery;
  if (benefit.includes('event')) return BENEFIT_ICONS.event;
  if (benefit.includes('points')) return BENEFIT_ICONS.points;
  if (benefit.includes('concierge')) return BENEFIT_ICONS.concierge;
  return <Star className="h-4 w-4" />;
}

export function VipTierCard() {
  const { tier, points, nextTier, pointsToNextTier, progressPercent, config } = useVipTier();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: config.color }}
        >
          {TIER_ICONS[tier]}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{config.name} Member</h3>
          <p className="text-sm text-slate-500">{points.toLocaleString()} points</p>
        </div>
      </div>

      {nextTier && (
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
            <span>Progress to {VIP_TIER_CONFIG[nextTier].name}</span>
            <span>{pointsToNextTier.toLocaleString()} pts needed</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full rounded-full transition-all"
              style={{ backgroundColor: config.color }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function VipTierList() {
  const { tier: currentTier } = useVipTier();

  return (
    <div className="space-y-3">
      {VIP_TIERS.map((tier) => {
        const config = VIP_TIER_CONFIG[tier];
        const isCurrent = tier === currentTier;
        const isLocked = VIP_TIERS.indexOf(tier) > VIP_TIERS.indexOf(currentTier);

        return (
          <div
            key={tier}
            className={`rounded-2xl border p-4 transition-all ${
              isCurrent
                ? 'border-amber-300 bg-amber-50 shadow-md'
                : isLocked
                  ? 'border-slate-200 bg-slate-50 opacity-60'
                  : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: config.color }}
                >
                  {TIER_ICONS[tier]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{config.name}</h4>
                  <p className="text-xs text-slate-500">
                    {config.minPoints.toLocaleString()}+ points
                  </p>
                </div>
              </div>
              {isCurrent && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                  Current
                </span>
              )}
            </div>

            <div className="mt-3 space-y-2">
              {config.benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="text-slate-400">{getBenefitIcon(benefit)}</span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
