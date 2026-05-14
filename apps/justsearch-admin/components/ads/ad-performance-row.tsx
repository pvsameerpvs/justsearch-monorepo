import { Megaphone, Clock } from "lucide-react";
import { AdMediaThumbnail } from "./ad-media-thumbnail";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";

interface AdPerformanceRowProps {
  campaign: AdCampaign;
}

export function AdPerformanceRow({ campaign }: AdPerformanceRowProps) {
  const completionRate = campaign.impressions > 0 ? Math.round((campaign.completions / campaign.impressions) * 100) : 0;

  return (
    <tr className="group hover:bg-slate-50/80 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <AdMediaThumbnail campaign={campaign} className="h-11 w-11 rounded-xl ring-1 ring-slate-200 shadow-sm" />
          <div>
            <p className="text-sm font-bold text-slate-900">{campaign.companyName}</p>
            <p className="text-xs text-slate-500">{campaign.title}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${campaign.type === "restaurant_brought" ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"}`}>
          {campaign.type === "restaurant_brought" ? "Restaurant" : "Platform"}
        </span>
      </td>
      <td className="px-5 py-3.5 text-right text-sm font-mono text-slate-600">
        <div className="flex items-center justify-end gap-1"><Clock className="h-3 w-3 text-slate-400" />{campaign.duration}s</div>
      </td>
      <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-700">{campaign.impressions.toLocaleString()}</td>
      <td className="px-5 py-3.5 text-right text-sm font-bold text-emerald-600">{campaign.completions.toLocaleString()}</td>
      <td className="px-5 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${completionRate}%` }} />
          </div>
          <span className="text-xs font-bold text-emerald-600">{completionRate}%</span>
        </div>
      </td>
      <td className="px-5 py-3.5 text-right text-sm font-bold text-amber-600">AED {campaign.revenue.toLocaleString()}</td>
      <td className="px-5 py-3.5 text-center">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${campaign.isActive ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"}`}>
          <Megaphone className="h-3 w-3" />{campaign.isActive ? "Active" : "Paused"}
        </span>
      </td>
    </tr>
  );
}
