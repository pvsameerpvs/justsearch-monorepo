"use client";

import { Gamepad2, DollarSign, Users, Megaphone } from 'lucide-react';
import { AnalyticsCard } from './analytics-cards';
import { GamePerformancePanel } from './game-performance-panel';
import { RevenueBreakdownPanel } from './revenue-breakdown-panel';
import { useAnalyticsSummaryQuery } from '@/lib/hooks/use-analytics-query';

export function AnalyticsDashboard() {
  const summary = useAnalyticsSummaryQuery();

  const today = summary.data?.today;
  const totalCustomers = summary.data?.totalCustomers ?? 0;
  const orderRevenue = today?.revenue ?? 0;
  const adRevenue = summary.data?.adRevenue ?? 0;
  const adViews = summary.data?.adViews ?? 0;
  const totalRevenue = orderRevenue + adRevenue;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          label="Today's Orders"
          value={String(today?.orders ?? 0)}
          icon={Gamepad2}
          color="bg-purple-50 text-purple-600"
        />
        <AnalyticsCard
          label="Order Revenue"
          value={`AED ${orderRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-emerald-50 text-emerald-600"
        />
        <AnalyticsCard
          label="Ad Revenue"
          value={`AED ${adRevenue.toLocaleString()}`}
          icon={Megaphone}
          color="bg-amber-50 text-amber-600"
        />
        <AnalyticsCard
          label="Total Customers"
          value={String(totalCustomers)}
          icon={Users}
          color="bg-blue-50 text-blue-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GamePerformancePanel />
        <RevenueBreakdownPanel orderRevenue={orderRevenue} adRevenue={adRevenue} adViews={adViews} />
      </div>
    </div>
  );
}
