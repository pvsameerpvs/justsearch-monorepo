import { BarChart3 } from "lucide-react";
import { DEMO_CAMPAIGNS } from "./demo-campaign-data";
import { DemoCampaignRow } from "./demo-campaign-row";
import { DemoStatCard } from "./demo-stat-card";

export function DemoCampaignsTable() {
  const totalRevenue = DEMO_CAMPAIGNS.reduce((s, c) => s + c.revenue, 0);
  const totalImpressions = DEMO_CAMPAIGNS.reduce((s, c) => s + c.impressions, 0);
  const totalCompletions = DEMO_CAMPAIGNS.reduce((s, c) => s + c.completions, 0);
  const avgRate = totalImpressions > 0 ? Math.round((totalCompletions / totalImpressions) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Campaign Performance</h2>
          <p className="text-sm text-slate-500">Demo campaigns — company details and ad metrics</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
          <BarChart3 className="h-3 w-3" />Demo Data
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <DemoStatCard label="Total Revenue" value={`AED ${totalRevenue.toLocaleString()}`} color="amber" />
        <DemoStatCard label="Impressions" value={totalImpressions.toLocaleString()} color="blue" />
        <DemoStatCard label="Completions" value={totalCompletions.toLocaleString()} color="emerald" />
        <DemoStatCard label="Avg Rate" value={`${avgRate}%`} color="purple" />
      </div>

      <div className="elegant-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Company & Ad</th>
                <th className="px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</th>
                <th className="px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Media</th>
                <th className="px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</th>
                <th className="px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Games</th>
                <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Impressions</th>
                <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Skips</th>
                <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Completions</th>
                <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Rate</th>
                <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenue</th>
                <th className="px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_CAMPAIGNS.map((c) => (<DemoCampaignRow key={c.id} campaign={c} />))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[10px] text-slate-500">
          <span>{DEMO_CAMPAIGNS.length} demo campaigns</span>
          <span>Revenue split: Restaurant 60% own | Platform 40% own</span>
        </div>
      </div>
    </div>
  );
}
