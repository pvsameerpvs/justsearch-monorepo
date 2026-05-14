import { CheckCircle, XCircle, Eye, Clock, TrendingUp, Gamepad2, Megaphone, Image, Video, FileImage } from "lucide-react";
import type { DemoCampaign } from "./demo-campaign-data";

const MEDIA_ICONS = {
  image: Image,
  video: Video,
  gif: FileImage,
};

interface DemoCampaignRowProps {
  campaign: DemoCampaign;
}

export function DemoCampaignRow({ campaign: c }: DemoCampaignRowProps) {
  const completionRate = c.impressions > 0 ? Math.round((c.completions / c.impressions) * 100) : 0;
  const skipRate = c.impressions > 0 ? Math.round((c.skips / c.impressions) * 100) : 0;
  const MediaIcon = MEDIA_ICONS[c.mediaType];

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 overflow-hidden shrink-0">
            {c.mediaType === "video" ? (
              <Video className="h-4 w-4 text-slate-500" />
            ) : c.mediaType === "gif" ? (
              <FileImage className="h-4 w-4 text-purple-500" />
            ) : (
              <Image className="h-4 w-4 text-slate-500" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{c.companyName}</p>
            <p className="text-[10px] text-slate-500 truncate">{c.title}</p>
            <p className="text-[10px] text-slate-400">{c.clientName}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${c.type === "restaurant_brought" ? "bg-indigo-50 text-indigo-700" : "bg-amber-50 text-amber-700"}`}>
          {c.type === "restaurant_brought" ? "Restaurant" : "Platform"}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex flex-col items-center gap-0.5">
          <MediaIcon className={`h-3.5 w-3.5 ${c.mediaType === "gif" ? "text-purple-500" : "text-slate-400"}`} />
          <span className="text-[9px] font-bold uppercase text-slate-400">{c.mediaType}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-center text-xs font-mono text-slate-700">
        <div className="flex items-center justify-center gap-1"><Clock className="h-3 w-3 text-slate-400" />{c.duration}s</div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1 text-xs font-mono text-slate-600">
          <Gamepad2 className="h-3 w-3 text-slate-400" />{c.assignedGames}
        </div>
      </td>
      <td className="px-4 py-3 text-right text-xs font-mono text-slate-700">
        <div className="flex items-center justify-end gap-1"><Eye className="h-3 w-3 text-slate-400" />{c.impressions.toLocaleString()}</div>
      </td>
      <td className="px-4 py-3 text-right text-xs font-mono text-red-500">
        <div className="flex items-center justify-end gap-1"><XCircle className="h-3 w-3" />{c.skips.toLocaleString()}</div>
      </td>
      <td className="px-4 py-3 text-right text-xs font-mono text-emerald-600 font-bold">
        <div className="flex items-center justify-end gap-1"><CheckCircle className="h-3 w-3" />{c.completions.toLocaleString()}</div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span className="text-xs font-mono font-bold text-emerald-600">{completionRate}%</span>
          </div>
          <span className="text-[9px] text-slate-400">skip {skipRate}%</span>
        </div>
      </td>
      <td className="px-4 py-3 text-right text-xs font-mono font-bold text-amber-600">AED {c.revenue.toLocaleString()}</td>
      <td className="px-4 py-3 text-center">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${c.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          <Megaphone className="h-3 w-3" />{c.isActive ? "Active" : "Paused"}
        </span>
      </td>
    </tr>
  );
}
