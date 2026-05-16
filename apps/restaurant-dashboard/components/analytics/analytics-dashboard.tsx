"use client";

import { Gamepad2, Gift, DollarSign, Users } from 'lucide-react';
import { AnalyticsCard } from './analytics-cards';
import { GamePerformancePanel } from './game-performance-panel';
import { RevenueBreakdownPanel } from './revenue-breakdown-panel';
import { useAnalyticsSummaryQuery } from '@/lib/hooks/use-analytics-query';

export function AnalyticsDashboard() {
  const summary = useAnalyticsSummaryQuery();

  const today = summary.data?.today;
  const totalCustomers = summary.data?.totalCustomers ?? 0;
  const revenue = today?.revenue ?? 0;

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
          label="Today's Revenue"
          value={`AED ${revenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-emerald-50 text-emerald-600"
        />
        <AnalyticsCard
          label="Avg Order Value"
          value={`AED ${Number(today?.avgOrderValue ?? 0).toFixed(2)}`}
          icon={Gift}
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
        <RevenueBreakdownPanel totalRevenue={revenue} />
      </div>
    </div>
  );
}
