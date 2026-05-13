import { Package, CheckCircle, XCircle, Bike, Calendar, TrendingUp } from "lucide-react";

interface LifetimeStats {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalDeliveries: number;
}

interface DriverLifetimeStatsProps {
  stats: LifetimeStats;
}

export function DriverLifetimeStats({ stats }: DriverLifetimeStatsProps) {
  const cards = [
    { label: "Lifetime Orders", value: stats.totalOrders, icon: Package, color: "bg-slate-50 text-slate-700 border-slate-200" },
    { label: "Completed", value: stats.completedOrders, icon: CheckCircle, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { label: "Cancelled", value: stats.cancelledOrders, icon: XCircle, color: "bg-red-50 text-red-700 border-red-200" },
    { label: "Deliveries", value: stats.totalDeliveries, icon: Bike, color: "bg-sky-50 text-sky-700 border-sky-200" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-slate-400" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Lifetime Performance</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`rounded-xl border p-2.5 text-center ${c.color}`}>
              <Icon className="mx-auto h-4 w-4 mb-1" />
              <p className="text-lg font-bold">{c.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-bold text-emerald-800">Lifetime Earnings</span>
        </div>
        <span className="text-lg font-bold text-emerald-700">AED {stats.totalRevenue}</span>
      </div>
    </div>
  );
}
