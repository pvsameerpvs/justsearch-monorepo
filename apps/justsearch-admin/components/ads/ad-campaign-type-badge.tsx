import type { AdCampaignType } from "@/lib/stores/ad-campaign-types";

const TYPE_META: Record<AdCampaignType, { label: string; color: string; bg: string }> = {
  restaurant_brought: { label: "Restaurant Brought", color: "text-purple-700", bg: "bg-purple-50" },
  platform: { label: "Platform", color: "text-blue-700", bg: "bg-blue-50" },
};

export function AdCampaignTypeBadge({ type }: { type: AdCampaignType }) {
  const meta = TYPE_META[type];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.bg} ${meta.color}`}>
      {meta.label}
    </span>
  );
}
