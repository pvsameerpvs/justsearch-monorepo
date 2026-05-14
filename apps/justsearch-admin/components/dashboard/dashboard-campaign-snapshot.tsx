import { Megaphone, Eye, Clock } from "lucide-react";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";

interface DashboardCampaignRowProps {
  campaign: AdCampaign;
}

function DashboardCampaignRow({ campaign }: DashboardCampaignRowProps) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
        <Megaphone className="h-4 w-4 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate">{campaign.title}</p>
        <p className="text-xs text-slate-500">{campaign.companyName}</p>
      </div>
      <div className="text-right">
        <div className="flex items-center justify-end gap-1 text-xs text-slate-500">
          <Eye className="h-3 w-3" />
          {campaign.impressions.toLocaleString()}
        </div>
        <div className="flex items-center justify-end gap-1 text-xs text-slate-500">
          <Clock className="h-3 w-3" />
          {campaign.duration}s
        </div>
      </div>
    </div>
  );
}

interface DashboardCampaignSnapshotProps {
  campaigns: AdCampaign[];
}

export function DashboardCampaignSnapshot({ campaigns }: DashboardCampaignSnapshotProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
          <Megaphone className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Live Campaigns</p>
          <p className="text-xs text-slate-500">Currently running ad campaigns</p>
        </div>
      </div>
      <div className="px-5 py-3 space-y-2">
        {campaigns.map((c) => (
          <DashboardCampaignRow key={c.id} campaign={c} />
        ))}
        {campaigns.length === 0 && (
          <p className="text-center text-xs text-slate-500 py-4">No active campaigns</p>
        )}
      </div>
    </div>
  );
}
