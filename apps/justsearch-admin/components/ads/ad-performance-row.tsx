import { Megaphone, CheckCircle, XCircle, Eye, Clock, TrendingUp } from "lucide-react";
import { AdMediaThumbnail } from "./ad-media-thumbnail";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";

interface AdPerformanceRowProps {
  campaign: AdCampaign;
}

export function AdPerformanceRow({ campaign }: AdPerformanceRowProps) {
  const completionRate = campaign.impressions > 0 ? Math.round((campaign.completions / campaign.impressions) * 100) : 0;
  const skipRate = campaign.impressions > 0 ? Math.round((campaign.skips / campaign.impressions) * 100) : 0;

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <AdMediaThumbnail campaign={campaign} />
          <div>
            <p className="text-xs font-bold text-slate-900">{campaign.companyName}</p>
            <p className="text-[10px] text-slate-500">{campaign.title}</p>
            <p className="text-[10px] text-slate-400">{campaign.clientName}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${campaign.type === "restaurant_brought" ? "bg-indigo-50 text-indigo-700" : "bg-amber-50 text-amber-700"}`}>
          {campaign.type === "restaurant_brought" ? "Restaurant" : "Platform"}
        </span>
      </td>
      <td className="px-4 py-3 text-right text-[10px] font-bold text-slate-500 uppercase">{campaign.mediaType}</td>
      <td className="px-4 py-3 text-right text-xs font-mono text-slate-700">
        <div className="flex items-center justify-end gap-1"><Clock className="h-3 w-3 text-slate-400" />{campaign.duration}s</div>
      </td>
      <td className="px-4 py-3 text-right text-xs font-mono text-slate-700">
        <div className="flex items-center justify-end gap-1"><Eye className="h-3 w-3 text-slate-400" />{campaign.impressions.toLocaleString()}</div>
      </td>
      <td className="px-4 py-3 text-right text-xs font-mono text-red-500">
        <div className="flex items-center justify-end gap-1"><XCircle className="h-3 w-3" />{campaign.skips.toLocaleString()}</div>
      </td>
      <td className="px-4 py-3 text-right text-xs font-mono text-emerald-600 font-bold">
        <div className="flex items-center justify-end gap-1"><CheckCircle className="h-3 w-3" />{campaign.completions.toLocaleString()}</div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <TrendingUp className="h-3 w-3 text-emerald-500" />
          <span className="text-xs font-mono font-bold text-emerald-600">{completionRate}%</span>
          <span className="text-[10px] text-slate-400 ml-1">(skip {skipRate}%)</span>
        </div>
      </td>
      <td className="px-4 py-3 text-right text-xs font-mono font-bold text-amber-600">AED {campaign.revenue.toLocaleString()}</td>
      <td className="px-4 py-3 text-center">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${campaign.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          <Megaphone className="h-3 w-3" />{campaign.isActive ? "Active" : "Paused"}
        </span>
      </td>
    </tr>
  );
}
