import type { RestaurantAdAnalytics } from "@/lib/stores/ad-analytics-utils";

interface AdRevenueSplitProps {
  analytics: RestaurantAdAnalytics;
}

export function AdRevenueSplit({ analytics }: AdRevenueSplitProps) {
  const restaurantPct = analytics.totalRevenue > 0 ? Math.round((analytics.restaurantShare / analytics.totalRevenue) * 100) : 0;
  const platformPct = 100 - restaurantPct;

  return (
    <div className="elegant-card p-5 space-y-4">
      <p className="text-sm font-bold text-slate-900">Revenue Split Breakdown</p>

      <div className="space-y-3">
        <SplitBar
          label="Restaurant Brought Clients (You get 60%)"
          amount={analytics.restaurantShare}
          total={analytics.totalRevenue}
          color="bg-purple-500"
          bg="bg-purple-50"
          textColor="text-purple-700"
        />
        <SplitBar
          label="Platform Advertisers (You get 40%)"
          amount={analytics.platformShare}
          total={analytics.totalRevenue}
          color="bg-blue-500"
          bg="bg-blue-50"
          textColor="text-blue-700"
        />
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-slate-50 border border-slate-100 p-3">
        <div className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full rounded-full bg-purple-500 transition-all" style={{ width: `${restaurantPct}%` } as React.CSSProperties} />
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="font-bold text-purple-700">You {restaurantPct}%</span>
          <span className="text-slate-400">|</span>
          <span className="font-bold text-blue-700">Platform {platformPct}%</span>
        </div>
      </div>
    </div>
  );
}

function SplitBar({ label, amount, total, color, bg, textColor }: { label: string; amount: number; total: number; color: string; bg: string; textColor: string }) {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
  return (
    <div className={`rounded-lg ${bg} border border-slate-100 p-3`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-bold ${textColor}`}>{label}</span>
        <span className={`text-sm font-bold ${textColor}`}>AED {Math.round(amount).toLocaleString()}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` } as React.CSSProperties} />
      </div>
      <p className="text-[10px] text-slate-500 mt-1">{pct}% of total revenue</p>
    </div>
  );
}
