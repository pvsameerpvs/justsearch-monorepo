import type { AdCampaign } from "@/lib/stores/ad-campaign-types";
import { AdCampaignTypeBadge } from "./ad-campaign-type-badge";
import { Clock, Gamepad2, Eye, CheckCircle, XCircle } from "lucide-react";

interface AdPreviewCardProps {
  campaign: AdCampaign;
}

export function AdPreviewCard({ campaign }: AdPreviewCardProps) {
  return (
    <div className="elegant-card p-0 overflow-hidden">
      {/* Media */}
      <div className="relative aspect-video bg-slate-100">
        {campaign.mediaType === 'video' ? (
          <video
            src={campaign.mediaUrl}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={campaign.mediaUrl}
            alt={campaign.title}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute top-2 right-2">
          <AdCampaignTypeBadge type={campaign.type} />
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold text-white">
          <Clock className="h-3 w-3" />
          {campaign.duration}s
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
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
            <span className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle className="h-3 w-3" />{campaign.completions}</span>
            <span className="flex items-center gap-1 text-red-500"><XCircle className="h-3 w-3" />{campaign.skips}</span>
          </div>
          <span className="font-bold text-amber-600">AED {campaign.revenue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
