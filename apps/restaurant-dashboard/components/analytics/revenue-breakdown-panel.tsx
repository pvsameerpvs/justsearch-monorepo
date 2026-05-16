import { BarChart3 } from 'lucide-react';
import { RevenueBar } from './analytics-cards';

export function RevenueBreakdownPanel({ totalRevenue }: { totalRevenue: number }) {
  return (
    <div className="card-premium p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <BarChart3 className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Revenue Breakdown</h3>
          <p className="text-sm text-slate-500">Today's performance</p>
        </div>
      </div>

      <div className="space-y-4">
        <RevenueBar label="Order Revenue" value={totalRevenue} total={totalRevenue || 1} color="bg-blue-500" />
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</p>
        <p className="mt-1 text-2xl font-black text-slate-900">AED {totalRevenue.toLocaleString()}</p>
      </div>
    </div>
  );
}
