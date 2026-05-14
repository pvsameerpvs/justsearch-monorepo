import { TrendingUp } from 'lucide-react';
import type { RestaurantRevenue } from '@/lib/constants/revenue.constants';

interface RevenueTopRestaurantsProps {
  restaurants: RestaurantRevenue[];
}

export function RevenueTopRestaurants({ restaurants }: RevenueTopRestaurantsProps) {
  const maxTotal = Math.max(...restaurants.map((r) => r.adRevenue + r.subscriptionRevenue), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-amber-500" />
        <h3 className="font-bold text-slate-900">Top Performers</h3>
      </div>

      <div className="mt-4 space-y-4">
        {restaurants.map((r, i) => {
          const total = r.adRevenue + r.subscriptionRevenue;
          const pct = Math.round((total / maxTotal) * 100);
          return (
            <div key={r.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900">
                  {i + 1}. {r.name}
                </span>
                <span className="font-bold text-slate-900">AED {total.toLocaleString()}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1 text-[10px] text-slate-400">{r.orders} orders · {r.views.toLocaleString()} views</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
