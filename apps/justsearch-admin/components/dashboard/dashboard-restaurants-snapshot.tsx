import { BarChart3 } from "lucide-react";
import type { RestaurantRevenue } from "@/lib/constants/revenue.constants";

interface DashboardRestaurantRowProps {
  restaurant: RestaurantRevenue;
  maxRevenue: number;
}

function DashboardRestaurantRow({ restaurant, maxRevenue }: DashboardRestaurantRowProps) {
  const total = restaurant.adRevenue + restaurant.subscriptionRevenue;
  const pct = Math.round((total / maxRevenue) * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">
        {restaurant.name.slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-900 truncate">{restaurant.name}</p>
          <span className="text-xs font-bold text-emerald-600">AED {total.toLocaleString()}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 mt-1">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

interface DashboardRestaurantsSnapshotProps {
  restaurants: RestaurantRevenue[];
}

export function DashboardRestaurantsSnapshot({ restaurants }: DashboardRestaurantsSnapshotProps) {
  const maxRevenue = Math.max(...restaurants.map((r) => r.adRevenue + r.subscriptionRevenue), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
          <BarChart3 className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Top Restaurants</p>
          <p className="text-xs text-slate-500">By total revenue this month</p>
        </div>
      </div>
      <div className="px-5 py-3 space-y-2">
        {restaurants.map((r) => (
          <DashboardRestaurantRow key={r.id} restaurant={r} maxRevenue={maxRevenue} />
        ))}
      </div>
    </div>
  );
}
