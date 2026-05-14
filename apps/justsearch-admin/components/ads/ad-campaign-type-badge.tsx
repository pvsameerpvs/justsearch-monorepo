import type { AdCampaignType } from "@/lib/stores/ad-campaign-types";

const TYPE_META: Record<AdCampaignType, { label: string; color: string; bg: string; dot: string }> = {
  restaurant_brought: { label: "Restaurant Brought", color: "text-purple-700", bg: "bg-purple-50", dot: "bg-purple-500" },
  platform: { label: "Platform", color: "text-blue-700", bg: "bg-blue-50", dot: "bg-blue-500" },
};

export function AdCampaignTypeBadge({ type }: { type: AdCampaignType }) {
  const meta = TYPE_META[type];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ring-1 ${meta.bg} ${meta.color} ${type === "restaurant_brought" ? "ring-purple-200" : "ring-blue-200"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
