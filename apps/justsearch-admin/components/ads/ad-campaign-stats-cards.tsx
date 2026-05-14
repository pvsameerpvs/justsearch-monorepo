import { Megaphone, TrendingUp, Users, DollarSign } from "lucide-react";
import { useAdCampaignStore } from "@/lib/stores/ad-campaign-store";

export function AdCampaignStatsCards() {
  const stats = useAdCampaignStore((s) => s.getStats)();

  const items = [
    { label: "Total Campaigns", value: stats.total, icon: Megaphone, color: "text-indigo-700", bg: "bg-indigo-50" },
    { label: "Active", value: stats.active, icon: TrendingUp, color: "text-emerald-700", bg: "bg-emerald-50" },
    { label: "Total Impressions", value: stats.totalImpressions.toLocaleString(), icon: Users, color: "text-blue-700", bg: "bg-blue-50" },
    { label: "Total Revenue", value: `AED ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-amber-700", bg: "bg-amber-50" },
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
