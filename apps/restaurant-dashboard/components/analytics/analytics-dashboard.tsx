"use client";

import { Gamepad2, Gift, DollarSign, Users, BarChart3, Activity } from 'lucide-react';
import { AnalyticsCard, PerformanceBar, RevenueBar } from './analytics-cards';

const ANALYTICS_DATA = {
  totalGamePlays: 15432,
  totalRewardsRedeemed: 892,
  totalRevenue: 186000,
  activeCustomers: 456,
  topGame: 'Jump & Bite',
  topGamePlays: 5430,
  avgSessionTime: '4m 32s',
  adRevenue: 12400,
  adImpressions: 45000,
  conversionRate: '68%',
  repeatRate: '42%',
};

export function AnalyticsDashboard() {
  const totalRevenue = ANALYTICS_DATA.totalRevenue + ANALYTICS_DATA.adRevenue;
  const restaurantShare = Math.round(ANALYTICS_DATA.adRevenue * 0.6);
  const justsearchShare = Math.round(ANALYTICS_DATA.adRevenue * 0.4);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard label="Game Plays" value={ANALYTICS_DATA.totalGamePlays.toLocaleString()} icon={Gamepad2} color="bg-purple-50 text-purple-600" />
        <AnalyticsCard label="Rewards Redeemed" value={ANALYTICS_DATA.totalRewardsRedeemed.toLocaleString()} icon={Gift} color="bg-amber-50 text-amber-600" />
        <AnalyticsCard label="Ad Revenue (AED)" value={ANALYTICS_DATA.adRevenue.toLocaleString()} icon={DollarSign} color="bg-emerald-50 text-emerald-600" />
        <AnalyticsCard label="Active Customers" value={ANALYTICS_DATA.activeCustomers.toLocaleString()} icon={Users} color="bg-blue-50 text-blue-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-premium p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Game Performance</h3>
              <p className="text-sm text-slate-500">Top performing metrics</p>
            </div>
          </div>

          <div className="space-y-4">
            <PerformanceBar label={ANALYTICS_DATA.topGame} value={ANALYTICS_DATA.topGamePlays} max={ANALYTICS_DATA.totalGamePlays} color="bg-purple-500" icon="🏃" />
            <PerformanceBar label="Avg. Session Time" value={ANALYTICS_DATA.avgSessionTime} max={ANALYTICS_DATA.avgSessionTime} color="bg-blue-500" icon="⏱️" isText />
            <PerformanceBar label="Conversion Rate" value={ANALYTICS_DATA.conversionRate} max="100%" color="bg-emerald-500" icon="📈" isText />
            <PerformanceBar label="Repeat Customer Rate" value={ANALYTICS_DATA.repeatRate} max="100%" color="bg-amber-500" icon="🔄" isText />
          </div>
        </div>

        <div className="card-premium p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Revenue Breakdown</h3>
              <p className="text-sm text-slate-500">Total: AED {totalRevenue.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <RevenueBar label="Order Revenue" value={ANALYTICS_DATA.totalRevenue} total={totalRevenue} color="bg-blue-500" />
            <RevenueBar label="Restaurant Ad Share (60%)" value={restaurantShare} total={totalRevenue} color="bg-amber-500" />
            <RevenueBar label="Platform Fee (40%)" value={justsearchShare} total={totalRevenue} color="bg-slate-400" />
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</p>
            <p className="mt-1 text-2xl font-black text-slate-900">
              AED {totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
