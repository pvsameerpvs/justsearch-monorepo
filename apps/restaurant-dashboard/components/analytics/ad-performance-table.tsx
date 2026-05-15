import NextImage from 'next/image';
import { Megaphone, CheckCircle, XCircle, Eye, Clock, TrendingUp, Gamepad2, Image, Video, FileImage } from "lucide-react";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";

interface AdPerformanceTableProps {
  campaigns: AdCampaign[];
}

const MEDIA_ICONS = {
  image: Image,
  video: Video,
  gif: FileImage,
};

export function AdPerformanceTable({ campaigns }: AdPerformanceTableProps) {
  if (campaigns.length === 0) {
    return (
      <div className="elegant-card overflow-hidden p-8 text-center">
        <p className="text-sm font-bold text-slate-700">No campaigns yet</p>
        <p className="text-xs text-slate-500 mt-1">Create your first ad campaign to see performance metrics</p>
      </div>
    );
  }

  return (
    <div className="elegant-card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">Campaign Performance</p>
            <p className="text-xs text-slate-500">Company details and ad metrics</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> Impressions</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-emerald-500" /> Completions</span>
            <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-400" /> Skips</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Company & Ad</th>
              <th className="px-4 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Media</th>
              <th className="px-4 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</th>
              <th className="px-4 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Games</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Impressions</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Skips</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Completions</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Rate</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenue</th>
              <th className="px-4 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => {
              const completionRate = c.impressions > 0 ? Math.round((c.completions / c.impressions) * 100) : 0;
              const skipRate = c.impressions > 0 ? Math.round((c.skips / c.impressions) * 100) : 0;
              const MediaIcon = MEDIA_ICONS[c.mediaType] ?? Image;
              return (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 overflow-hidden shrink-0">
                        {c.mediaType === 'video' ? (
                          <Video className="h-4 w-4 text-slate-500" />
                        ) : c.mediaType === 'gif' ? (
                          <FileImage className="h-4 w-4 text-purple-500" />
                        ) : c.mediaUrl ? (
                          <NextImage src={c.mediaUrl} alt="" fill className="object-cover" sizes="36px" />
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
                    <div className="flex flex-col items-center gap-0.5">
                      <MediaIcon className={`h-3.5 w-3.5 ${c.mediaType === 'gif' ? 'text-purple-500' : 'text-slate-400'}`} />
                      <span className="text-[9px] font-bold uppercase text-slate-400">{c.mediaType}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-xs font-mono text-slate-700">
                    <div className="flex items-center justify-center gap-1"><Clock className="h-3 w-3 text-slate-400" />{c.duration}s</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500">
                      <Gamepad2 className="h-3 w-3" />
                      {c.assignedGames.length}
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
            })}
          </tbody>
        </table>
      </div>
      {/* Summary footer */}
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[10px] text-slate-500">
        <span>{campaigns.length} campaigns</span>
        <span>Last updated: {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
}
