"use client";

import { Gamepad2, Gift, DollarSign, Users } from 'lucide-react';
import { AnalyticsCard } from './analytics-cards';
import { GamePerformancePanel } from './game-performance-panel';
import { RevenueBreakdownPanel } from './revenue-breakdown-panel';

const DATA = {
  totalGamePlays: 15432,
  totalRewardsRedeemed: 892,
  totalRevenue: 186000,
  activeCustomers: 456,
  adRevenue: 12400,
};

export function AnalyticsDashboard() {
  const totalRevenue = DATA.totalRevenue + DATA.adRevenue;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard label="Game Plays" value={DATA.totalGamePlays.toLocaleString()} icon={Gamepad2} color="bg-purple-50 text-purple-600" />
        <AnalyticsCard label="Rewards Redeemed" value={DATA.totalRewardsRedeemed.toLocaleString()} icon={Gift} color="bg-amber-50 text-amber-600" />
        <AnalyticsCard label="Ad Revenue (AED)" value={DATA.adRevenue.toLocaleString()} icon={DollarSign} color="bg-emerald-50 text-emerald-600" />
        <AnalyticsCard label="Active Customers" value={DATA.activeCustomers.toLocaleString()} icon={Users} color="bg-blue-50 text-blue-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GamePerformancePanel />
        <RevenueBreakdownPanel totalRevenue={totalRevenue} orderRevenue={DATA.totalRevenue} adRevenue={DATA.adRevenue} />
      </div>
    </div>
  );
}
