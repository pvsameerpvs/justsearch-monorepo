"use client";

import { DollarSign, TrendingUp, PieChart, ArrowUpRight } from 'lucide-react';

const REVENUE_DATA = {
  totalRevenue: 45000,
  adRevenue: 18000,
  subscriptionRevenue: 27000,
  restaurantCount: 12,
  avgPerRestaurant: 3750,
  growth: '+18%',
  topRestaurant: 'Mosaic Table',
  topRestaurantRevenue: 18600,
  adSplit: { restaurant: 60, justsearch: 40 },
};

export function RevenueDashboard() {
  const restaurantAdShare = Math.round(REVENUE_DATA.adRevenue * (REVENUE_DATA.adSplit.restaurant / 100));
  const justsearchAdShare = Math.round(REVENUE_DATA.adRevenue * (REVENUE_DATA.adSplit.justsearch / 100));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RevenueCard
          label="Total Revenue"
          value={`AED ${REVENUE_DATA.totalRevenue.toLocaleString()}`}
          change={REVENUE_DATA.growth}
          icon={DollarSign}
          color="bg-green-100 text-green-700"
        />
        <RevenueCard
          label="Ad Revenue"
          value={`AED ${REVENUE_DATA.adRevenue.toLocaleString()}`}
          change="+24%"
          icon={TrendingUp}
          color="bg-amber-100 text-amber-700"
        />
        <RevenueCard
          label="Subscriptions"
          value={`AED ${REVENUE_DATA.subscriptionRevenue.toLocaleString()}`}
          change="+12%"
          icon={PieChart}
          color="bg-blue-100 text-blue-700"
        />
        <RevenueCard
          label="Restaurants"
          value={REVENUE_DATA.restaurantCount.toString()}
          change="+2 this month"
          icon={ArrowUpRight}
          color="bg-purple-100 text-purple-700"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">Ad Revenue Split</h3>
          <div className="mt-4 space-y-4">
            <SplitBar
              label={`Restaurant (60%)`}
              value={restaurantAdShare}
              total={REVENUE_DATA.adRevenue}
              color="bg-amber-500"
            />
            <SplitBar
              label={`JustSearch (40%)`}
              value={justsearchAdShare}
              total={REVENUE_DATA.adRevenue}
              color="bg-slate-500"
            />
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-center">
            <p className="text-xs text-slate-500">Your Share (40%)</p>
            <p className="text-xl font-bold text-slate-900">
              AED {justsearchAdShare.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">Top Performing Restaurant</h3>
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="font-bold text-slate-900">{REVENUE_DATA.topRestaurant}</p>
            <p className="text-sm text-slate-500">
              AED {REVENUE_DATA.topRestaurantRevenue.toLocaleString()} revenue
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${(REVENUE_DATA.topRestaurantRevenue / REVENUE_DATA.totalRevenue) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RevenueCard({
  label,
  value,
  change,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
          {change}
        </span>
      </div>
      <p className="mt-3 text-2xl font-black text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function SplitBar({
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
      <div className="mt-1 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
