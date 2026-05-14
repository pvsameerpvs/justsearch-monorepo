import { CheckCircle, XCircle, Eye } from "lucide-react";
import { AdPerformanceRow } from "./ad-performance-row";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";

interface AdPerformanceTableProps {
  campaigns: AdCampaign[];
}

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
              <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Media</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Impressions</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Skips</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Completions</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Rate</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenue</th>
              <th className="px-4 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <AdPerformanceRow key={c.id} campaign={c} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
