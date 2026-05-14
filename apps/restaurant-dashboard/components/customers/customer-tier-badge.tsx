import { TIER_CONFIG } from "./types/customer.types";

interface CustomerTierBadgeProps {
  tier: string;
}

export function CustomerTierBadge({ tier }: CustomerTierBadgeProps) {
  const meta = TIER_CONFIG[tier] ?? TIER_CONFIG.Bronze;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.bg} ${meta.color}`}>
      <Icon className="h-3 w-3" />
      {tier}
    </span>
  );
}
