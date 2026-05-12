"use client";

import { DollarSign, TrendingUp, PieChart, ArrowUpRight } from 'lucide-react';
import { RevenueCard } from './revenue-card';
import { AdRevenueSplitPanel } from './ad-revenue-split-panel';
import { TopPerformingRestaurantPanel } from './top-performing-restaurant-panel';

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
  const restaurantAdShare = Math.round(
    REVENUE_DATA.adRevenue * (REVENUE_DATA.adSplit.restaurant / 100)
  );
  const justsearchAdShare = Math.round(
    REVENUE_DATA.adRevenue * (REVENUE_DATA.adSplit.justsearch / 100)
  );

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
        <AdRevenueSplitPanel
          restaurantAdShare={restaurantAdShare}
          justsearchAdShare={justsearchAdShare}
          adRevenue={REVENUE_DATA.adRevenue}
        />
        <TopPerformingRestaurantPanel
          topRestaurant={REVENUE_DATA.topRestaurant}
          topRestaurantRevenue={REVENUE_DATA.topRestaurantRevenue}
          totalRevenue={REVENUE_DATA.totalRevenue}
        />
      </div>
    </div>
  );
}
