import { create } from 'zustand';
import { RESTAURANT_REVENUE_DATA } from '@/lib/constants/restaurant-revenue.constants';
import type { RestaurantRevenue } from '@/lib/constants/revenue.constants';

export type RevenueSummary = {
  totalRevenue: number;
  adRevenue: number;
  subscriptionRevenue: number;
  activeRestaurants: number;
  totalOrders: number;
  totalViews: number;
  avgRevenuePerRestaurant: number;
  growthPercent: number;
};

export type RevenueStore = {
  restaurants: RestaurantRevenue[];
  summary: RevenueSummary;
};

function computeSummary(restaurants: RestaurantRevenue[]): RevenueSummary {
  const active = restaurants.filter((r) => r.status === 'active');
  const adRevenue = restaurants.reduce((sum, r) => sum + r.adRevenue, 0);
  const subscriptionRevenue = restaurants.reduce((sum, r) => sum + r.subscriptionRevenue, 0);

  return {
    totalRevenue: adRevenue + subscriptionRevenue,
    adRevenue,
    subscriptionRevenue,
    activeRestaurants: active.length,
    totalOrders: restaurants.reduce((sum, r) => sum + r.orders, 0),
    totalViews: restaurants.reduce((sum, r) => sum + r.views, 0),
    avgRevenuePerRestaurant: active.length > 0 ? Math.round(active.reduce((sum, r) => sum + r.adRevenue + r.subscriptionRevenue, 0) / active.length) : 0,
    growthPercent: 18,
  };
}

export const useRevenueStore = create<RevenueStore>(() => ({
  restaurants: [...RESTAURANT_REVENUE_DATA],
  summary: computeSummary(RESTAURANT_REVENUE_DATA),
}));
