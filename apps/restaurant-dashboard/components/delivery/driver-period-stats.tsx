import { TrendingUp } from "lucide-react";
import type { DriverDateFilter } from "./use-driver-order-filter";

interface PeriodStats {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

interface DriverPeriodStatsProps {
  stats: PeriodStats;
  filter: DriverDateFilter;
}

const FILTER_LABELS: Record<DriverDateFilter, string> = {
  today: "Today's",
  yesterday: "Yesterday's",
  week: "Last 7 Days",
  month: "This Month",
  all: "Lifetime",
};

export function DriverPeriodStats({ stats, filter }: DriverPeriodStatsProps) {
  const label = FILTER_LABELS[filter];

  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label} Summary</p>
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center">
          <p className="text-sm font-bold text-slate-900">{stats.totalOrders}</p>
          <p className="text-[9px] font-medium text-slate-500">Orders</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-emerald-700">{stats.completedOrders}</p>
          <p className="text-[9px] font-medium text-slate-500">Done</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-red-700">{stats.cancelledOrders}</p>
          <p className="text-[9px] font-medium text-slate-500">Failed</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-600" />
            <p className="text-sm font-bold text-emerald-700">{stats.totalRevenue}</p>
          </div>
          <p className="text-[9px] font-medium text-slate-500">AED</p>
        </div>
      </div>
    </div>
  );
}
