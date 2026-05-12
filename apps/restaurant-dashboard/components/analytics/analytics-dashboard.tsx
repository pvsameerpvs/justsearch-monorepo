"use client";

import { TrendingUp, Gamepad2, Gift, DollarSign, Users, Star } from 'lucide-react';

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
};

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Game Plays"
          value={ANALYTICS_DATA.totalGamePlays.toLocaleString()}
          icon={Gamepad2}
          color="bg-purple-100 text-purple-700"
        />
        <StatCard
          label="Rewards Redeemed"
          value={ANALYTICS_DATA.totalRewardsRedeemed.toLocaleString()}
          icon={Gift}
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          label="Ad Revenue (AED)"
          value={ANALYTICS_DATA.adRevenue.toLocaleString()}
          icon={DollarSign}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          label="Active Customers"
          value={ANALYTICS_DATA.activeCustomers.toLocaleString()}
          icon={Users}
          color="bg-blue-100 text-blue-700"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">Game Performance</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏃</span>
                <div>
                  <p className="font-bold text-slate-900">{ANALYTICS_DATA.topGame}</p>
                  <p className="text-xs text-slate-500">Most played game</p>
                </div>
              </div>
              <p className="font-bold text-slate-900">{ANALYTICS_DATA.topGamePlays.toLocaleString()} plays</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="font-bold text-slate-900">Avg. Session</p>
                  <p className="text-xs text-slate-500">Time per game</p>
                </div>
              </div>
              <p className="font-bold text-slate-900">{ANALYTICS_DATA.avgSessionTime}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">Revenue Breakdown</h3>
          <div className="mt-4 space-y-3">
            <RevenueRow label="Order Revenue" value={ANALYTICS_DATA.totalRevenue} total={ANALYTICS_DATA.totalRevenue + ANALYTICS_DATA.adRevenue} color="bg-blue-500" />
            <RevenueRow label="Ad Revenue (60%)" value={ANALYTICS_DATA.adRevenue * 0.6} total={ANALYTICS_DATA.totalRevenue + ANALYTICS_DATA.adRevenue} color="bg-amber-500" />
            <RevenueRow label="Platform Fee (40%)" value={ANALYTICS_DATA.adRevenue * 0.4} total={ANALYTICS_DATA.totalRevenue + ANALYTICS_DATA.adRevenue} color="bg-slate-400" />
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-center">
            <p className="text-xs text-slate-500">Total Revenue</p>
            <p className="text-xl font-bold text-slate-900">
              AED {(ANALYTICS_DATA.totalRevenue + ANALYTICS_DATA.adRevenue).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-2xl font-black text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function RevenueRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percent = Math.round((value / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="font-bold text-slate-900">AED {value.toLocaleString()}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
