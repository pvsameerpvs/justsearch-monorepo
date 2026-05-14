import { Eye, EyeOff, Image, Video, FileImage, Gamepad2 } from "lucide-react";
import { AdCampaignTypeBadge } from "./ad-campaign-type-badge";
import { AdCampaignRowActions } from "./ad-campaign-row-actions";
import { AdMediaThumbnail } from "./ad-media-thumbnail";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";

const MEDIA_ICONS = {
  image: Image,
  video: Video,
  gif: FileImage,
};

interface AdCampaignRowProps {
  campaign: AdCampaign;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function AdCampaignRow({ campaign, onEdit, onDelete, onToggle }: AdCampaignRowProps) {
  const MediaIcon = MEDIA_ICONS[campaign.mediaType];

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <AdMediaThumbnail campaign={campaign} />
          <MediaIcon className="h-3 w-3 text-slate-400" />
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-xs font-bold text-slate-900">{campaign.companyName}</p>
        <p className="text-[10px] text-slate-500">{campaign.clientName}</p>
      </td>
      <td className="px-4 py-3">
        <AdCampaignTypeBadge type={campaign.type} />
      </td>
      <td className="px-4 py-3 text-xs text-slate-600">{campaign.restaurantName ?? "All"}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Gamepad2 className="h-3 w-3" />
          {campaign.assignedGames.length} games
        </div>
      </td>
      <td className="px-4 py-3 text-right text-xs font-mono text-slate-700">{campaign.duration}s</td>
      <td className="px-4 py-3 text-right text-xs font-mono font-bold text-amber-600">
        AED {campaign.revenue.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => onToggle(campaign.id)}
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${campaign.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
        >
          {campaign.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          {campaign.isActive ? "Active" : "Paused"}
        </button>
      </td>
      <td className="px-4 py-3 text-right">
        <AdCampaignRowActions onEdit={() => onEdit(campaign.id)} onDelete={() => onDelete(campaign.id)} />
      </td>
    </tr>
  );
}
