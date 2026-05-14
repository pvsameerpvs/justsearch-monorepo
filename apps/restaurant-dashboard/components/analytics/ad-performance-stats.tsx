import { DollarSign, Users, CheckCircle, TrendingUp } from "lucide-react";
import type { RestaurantAdAnalytics } from "@/lib/stores/ad-analytics-utils";

interface AdPerformanceStatsProps {
  analytics: RestaurantAdAnalytics;
}

export function AdPerformanceStats({ analytics }: AdPerformanceStatsProps) {
  const items = [
    { label: "Total Ad Revenue", value: `AED ${analytics.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-amber-700", bg: "bg-amber-50" },
    { label: "Your Share", value: `AED ${Math.round(analytics.restaurantShare).toLocaleString()}`, icon: TrendingUp, color: "text-emerald-700", bg: "bg-emerald-50" },
    { label: "Total Impressions", value: analytics.totalImpressions.toLocaleString(), icon: Users, color: "text-blue-700", bg: "bg-blue-50" },
    { label: "Completions", value: analytics.totalCompletions.toLocaleString(), icon: CheckCircle, color: "text-purple-700", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className={`elegant-card p-4 ${item.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${item.color}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${item.color}`}>{item.label}</span>
            </div>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        );
      })}
    </div>
  );
}
