import { BarChart3, CheckCircle, XCircle, Eye } from "lucide-react";
import { AdPerformanceRow } from "./ad-performance-row";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";

interface AdPerformanceTableProps {
  campaigns: AdCampaign[];
}

export function AdPerformanceTable({ campaigns }: AdPerformanceTableProps) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 mx-auto mb-3">
          <BarChart3 className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-sm font-bold text-slate-700">No campaigns yet</p>
        <p className="text-xs text-slate-500 mt-1">Create your first ad campaign to see performance metrics</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Campaign Performance</p>
              <p className="text-xs text-slate-500">Impressions, completions, and revenue</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400">
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> Impressions</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-emerald-500" /> Completions</span>
            <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-400" /> Skips</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Campaign</th>
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Impressions</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Completions</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Rate</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenue</th>
              <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {campaigns.map((c) => (
              <AdPerformanceRow key={c.id} campaign={c} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
