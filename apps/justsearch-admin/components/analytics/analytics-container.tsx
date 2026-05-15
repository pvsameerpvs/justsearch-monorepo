'use client';

import { useMemo } from 'react';

import { useRestaurantsQuery } from '@/lib/hooks/use-restaurants-query';
import { useUsersAdminQuery } from '@/lib/hooks/use-users-admin-query';
import { useRevenueAdminQuery } from '@/lib/hooks/use-revenue-admin-query';
import { useAdsQuery } from '@/lib/hooks/use-ads-query';
import { useAnalyticsAdminQuery } from '@/lib/hooks/use-analytics-admin-query';

import { computeRestaurantRows, computeGameStats, computeTopAdCampaigns } from '@/lib/utils/analytics.utils';

import { AnalyticsPresenter } from './analytics-presenter';

export function AnalyticsContainer() {
  const { restaurants } = useRestaurantsQuery();
  const { users } = useUsersAdminQuery();
  const { restaurants: revenueRestaurants, isLoading: revenueLoading } = useRevenueAdminQuery();
  const { ads: campaigns } = useAdsQuery();
  const { analytics, isLoading: analyticsLoading } = useAnalyticsAdminQuery();

  const isLoading = revenueLoading || analyticsLoading;

  const summary = analytics ?? {
    totalRestaurants: 0,
    activeRestaurants: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalGamePoints: 0,
    totalAdRevenue: 0,
    totalAdImpressions: 0,
    activeCampaigns: 0,
    totalCampaigns: 0,
    totalOrders: 0,
    totalViews: 0,
    avgPointsPerUser: 0,
    monthlyData: [],
  };

  const monthlyData = analytics?.monthlyData ?? [];

  const restaurantRows = useMemo(
    () => computeRestaurantRows(revenueRestaurants, restaurants, users),
    [revenueRestaurants, restaurants, users]
  );

  const topRestaurants = useMemo(
    () =>
      [...restaurantRows]
        .sort((a, b) => b.adRevenue + b.subscriptionRevenue - (a.adRevenue + a.subscriptionRevenue))
        .slice(0, 5),
    [restaurantRows]
  );

  const gameStats = useMemo(() => computeGameStats(), []);
  const adStats = useMemo(() => computeTopAdCampaigns(campaigns), [campaigns]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <AnalyticsPresenter
      summary={summary}
      monthlyData={monthlyData}
      topRestaurants={topRestaurants}
      gameStats={gameStats}
      adStats={adStats}
    />
  );
}
