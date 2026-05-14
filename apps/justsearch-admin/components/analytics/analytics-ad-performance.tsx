import { Megaphone, Eye, CheckCircle } from "lucide-react";

import type { AdStat } from "./types/analytics.types";

interface AnalyticsAdPerformanceProps {
  campaigns: AdStat[];
}

export function AnalyticsAdPerformance({ campaigns }: AnalyticsAdPerformanceProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
          <Megaphone className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Top Ad Campaigns</p>
          <p className="text-xs text-slate-500">By revenue and completion rate</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Campaign</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Impressions</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Rate</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{c.title}</p>
                    <p className="text-xs text-slate-500">{c.companyName}</p>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold mt-1 ${c.type === "restaurant_brought" ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"}`}>
                      {c.type === "restaurant_brought" ? "Restaurant" : "Platform"}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right text-sm text-slate-700">
                  <div className="flex items-center justify-end gap-1"><Eye className="h-3 w-3 text-slate-400" />{c.impressions.toLocaleString()}</div>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-600">{c.completionRate}%</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right text-sm font-bold text-amber-600">AED {c.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
