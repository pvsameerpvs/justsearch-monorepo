import { Users, UserPlus, Activity, Wallet } from "lucide-react";
import type { CustomerStats } from "./types/customer.types";

const STAT_ITEMS = [
  { key: "total" as const, label: "Total", icon: Users, color: "text-slate-700", bg: "bg-slate-100" },
  { key: "newThisMonth" as const, label: "New This Month", icon: UserPlus, color: "text-indigo-700", bg: "bg-indigo-50" },
  { key: "activeThisWeek" as const, label: "Active This Week", icon: Activity, color: "text-emerald-700", bg: "bg-emerald-50" },
  { key: "totalRevenue" as const, label: "Total Revenue", icon: Wallet, color: "text-amber-700", bg: "bg-amber-50" },
];

export function CustomerStatsCards({ stats }: { stats: CustomerStats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STAT_ITEMS.map((item) => {
        const Icon = item.icon;
        const value = item.key === "totalRevenue" ? `AED ${stats[item.key].toLocaleString()}` : stats[item.key];
        return (
          <div key={item.key} className={`elegant-card p-4 ${item.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${item.color}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${item.color}`}>{item.label}</span>
            </div>
            <p className={`text-2xl font-bold ${item.color}`}>{value}</p>
          </div>
        );
      })}
    </div>
  );
}
