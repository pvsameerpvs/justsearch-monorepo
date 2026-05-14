import { DollarSign, TrendingUp, PieChart, Store } from 'lucide-react';
import { RevenueCard } from './revenue-card';
import type { RevenueSummary } from '@/lib/stores/revenue-store';

interface RevenueStatsCardsProps {
  summary: RevenueSummary;
}

export function RevenueStatsCards({ summary }: RevenueStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <RevenueCard
        label="Total Revenue"
        value={`AED ${summary.totalRevenue.toLocaleString()}`}
        change={`+${summary.growthPercent}%`}
        icon={DollarSign}
        color="bg-emerald-100 text-emerald-700"
      />
      <RevenueCard
        label="Ad Revenue"
        value={`AED ${summary.adRevenue.toLocaleString()}`}
        change="+24%"
        icon={TrendingUp}
        color="bg-amber-100 text-amber-700"
      />
      <RevenueCard
        label="Subscription Revenue"
        value={`AED ${summary.subscriptionRevenue.toLocaleString()}`}
        change="+12%"
        icon={PieChart}
        color="bg-blue-100 text-blue-700"
      />
      <RevenueCard
        label="Active Restaurants"
        value={String(summary.activeRestaurants)}
        change={`${summary.totalOrders} orders`}
        icon={Store}
        color="bg-violet-100 text-violet-700"
      />
    </div>
  );
}
