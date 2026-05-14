import { BarChart3 } from "lucide-react";

import type { ComputedRestaurantRow } from "./types/analytics.types";

interface AnalyticsTopRestaurantsProps {
  restaurants: ComputedRestaurantRow[];
}

export function AnalyticsTopRestaurants({ restaurants }: AnalyticsTopRestaurantsProps) {
  const maxRevenue = Math.max(
    ...restaurants.map((r) => r.adRevenue + r.subscriptionRevenue),
    1
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
          <BarChart3 className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Top Restaurants</p>
          <p className="text-xs text-slate-500">By total revenue</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Restaurant</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Users</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Orders</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {restaurants.map((r) => {
              const revenue = r.adRevenue + r.subscriptionRevenue;
              const pct = Math.round((revenue / maxRevenue) * 100);
              return (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">
                        {r.name.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{r.name}</p>
                        <p className="text-xs text-slate-500">{r.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right text-sm text-slate-700">{r.userCount}</td>
                  <td className="px-5 py-3 text-right text-sm text-slate-700">{r.orders}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-sm font-bold text-emerald-600">AED {revenue.toLocaleString()}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
