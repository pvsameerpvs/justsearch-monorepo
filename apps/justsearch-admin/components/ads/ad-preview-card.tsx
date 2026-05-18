import { Clock, Gamepad2, Eye, CheckCircle, XCircle } from "lucide-react";
import { AdCampaignTypeBadge } from "./ad-campaign-type-badge";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";

interface AdPreviewCardProps {
  campaign: AdCampaign;
}

export function AdPreviewCard({ campaign }: AdPreviewCardProps) {
  const hasUrl = campaign.mediaUrl && campaign.mediaUrl.trim() !== "";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
        {campaign.mediaType === "video" && hasUrl ? (
          <video src={campaign.mediaUrl.trim()} className="h-full w-full object-cover" muted loop playsInline preload="metadata" controls />
        ) : hasUrl ? (
          <img src={campaign.mediaUrl.trim()} alt={campaign.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl opacity-20">🖼️</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{campaign.mediaType}</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <AdCampaignTypeBadge type={campaign.type} />
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white">
          <Clock className="h-3 w-3" />
          {campaign.duration}s
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <p className="text-sm font-bold text-slate-900">{campaign.title}</p>
          <p className="text-xs text-slate-500">{campaign.companyName}</p>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><Gamepad2 className="h-3 w-3" />{campaign.assignedGames.length} games</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{campaign.impressions.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle className="h-3 w-3" />{Math.round(campaign.impressions * 0.7)}</span>
            <span className="flex items-center gap-1 text-red-500"><XCircle className="h-3 w-3" />{Math.round(campaign.impressions * 0.3)}</span>
          </div>
          <span className="font-bold text-amber-600">AED {campaign.revenue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
