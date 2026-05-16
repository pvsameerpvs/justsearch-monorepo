import { Gamepad2 } from "lucide-react";
import { AdCampaignTypeBadge } from "./ad-campaign-type-badge";
import { AdCampaignRowActions } from "./ad-campaign-row-actions";
import { AdMediaThumbnail } from "./ad-media-thumbnail";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";

interface AdCampaignRowProps {
  campaign: AdCampaign;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function AdCampaignRow({ campaign, onEdit, onDelete, onToggle }: AdCampaignRowProps) {
  return (
    <tr className="group hover:bg-slate-50/80 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <AdMediaThumbnail campaign={campaign} className="h-11 w-11 rounded-xl ring-1 ring-slate-200 shadow-sm" />
          <div>
            <p className="text-sm font-bold text-slate-900">{campaign.title}</p>
            <p className="text-xs text-slate-500">{campaign.mediaType} • {campaign.duration}s</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">{campaign.companyName}</td>
      <td className="px-5 py-3.5">
        <AdCampaignTypeBadge type={campaign.type} />
      </td>
      <td className="px-5 py-3.5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          <Gamepad2 className="h-3 w-3 text-slate-400" />
          {campaign.assignedGames.length}
        </div>
      </td>
      <td className="px-5 py-3.5 text-right text-sm font-mono text-slate-600">{campaign.duration}s</td>
      <td className="px-5 py-3.5 text-right">
        <span className="text-sm font-bold text-amber-600">AED {campaign.revenue.toLocaleString()}</span>
      </td>
      <td className="px-5 py-3.5 text-center">
        <button
          onClick={() => onToggle(campaign.id)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors ${
            campaign.isActive
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${campaign.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
          {campaign.isActive ? "Active" : "Paused"}
        </button>
      </td>
      <td className="px-5 py-3.5 text-right">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <AdCampaignRowActions onEdit={() => onEdit(campaign.id)} onDelete={() => onDelete(campaign.id)} />
        </div>
      </td>
    </tr>
  );
}
