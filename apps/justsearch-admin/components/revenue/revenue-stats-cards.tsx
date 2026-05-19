import { DollarSign, TrendingUp, PieChart, Store } from 'lucide-react';
import { RevenueCard } from './revenue-card';
import type { RevenueResponse } from '@/lib/hooks/use-revenue-admin-query';

interface RevenueStatsCardsProps {
  summary: RevenueResponse;
}

export function RevenueStatsCards({ summary }: RevenueStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <RevenueCard
        label="Total Revenue"
        value={`AED ${summary.totalRevenue.toLocaleString()}`}
        change={`${summary.growthPercent > 0 ? '+' : ''}${summary.growthPercent}%`}
        icon={DollarSign}
        color="bg-emerald-100 text-emerald-700"
      />
      <RevenueCard
        label="Ad Revenue"
        value={`AED ${summary.adRevenue.toLocaleString()}`}
        change={`${summary.totalViews.toLocaleString()} views`}
        icon={TrendingUp}
        color="bg-amber-100 text-amber-700"
      />
      <RevenueCard
        label="Subscription Revenue"
        value={`AED ${summary.subscriptionRevenue.toLocaleString()}`}
        change="Coming soon"
        icon={PieChart}
        color="bg-blue-100 text-blue-700"
      />
      <RevenueCard
        label="Active Restaurants"
        value={String(summary.activeRestaurants)}
        change={`${summary.totalOrders.toLocaleString()} orders`}
        icon={Store}
        color="bg-violet-100 text-violet-700"
      />
    </div>
  );
}
