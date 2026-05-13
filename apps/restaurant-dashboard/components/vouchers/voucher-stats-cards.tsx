import { Ticket, Clock, Calendar, Zap } from "lucide-react";
import type { VoucherStats } from "./types/voucher.types";

interface VoucherStatsProps {
  stats: VoucherStats;
}

const STAT_ITEMS = [
  { key: "total" as const, label: "Total", icon: Ticket, color: "text-slate-700", bg: "bg-slate-100" },
  { key: "active" as const, label: "Active", icon: Zap, color: "text-emerald-700", bg: "bg-emerald-50" },
  { key: "scheduled" as const, label: "Upcoming", icon: Calendar, color: "text-amber-700", bg: "bg-amber-50" },
  { key: "expired" as const, label: "Expired", icon: Clock, color: "text-red-700", bg: "bg-red-50" },
];

export function VoucherStatsCards({ stats }: VoucherStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STAT_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.key} className={`elegant-card p-4 ${item.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${item.color}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${item.color}`}>
                {item.label}
              </span>
            </div>
            <p className={`text-2xl font-bold ${item.color}`}>{stats[item.key]}</p>
          </div>
        );
      })}
    </div>
  );
}
