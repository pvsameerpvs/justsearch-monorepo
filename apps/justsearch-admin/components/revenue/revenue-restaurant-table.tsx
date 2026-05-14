import { RevenueRestaurantRow } from './revenue-restaurant-row';
import type { RestaurantRevenue } from '@/lib/constants/revenue.constants';

interface RevenueRestaurantTableProps {
  restaurants: RestaurantRevenue[];
}

export function RevenueRestaurantTable({ restaurants }: RevenueRestaurantTableProps) {
  const sorted = [...restaurants].sort(
    (a, b) => b.adRevenue + b.subscriptionRevenue - (a.adRevenue + a.subscriptionRevenue)
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Restaurant Revenue</h3>
        <span className="text-xs font-medium text-slate-400">Sorted by total revenue</span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Restaurant</th>
              <th className="pb-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
              <th className="pb-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Orders</th>
              <th className="pb-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Views</th>
              <th className="pb-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Ad Rev</th>
              <th className="pb-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.map((r) => (
              <RevenueRestaurantRow key={r.id} restaurant={r} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
