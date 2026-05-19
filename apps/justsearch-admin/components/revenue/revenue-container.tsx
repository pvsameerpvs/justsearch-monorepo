'use client';

import { useRevenueAdminQuery, useRevenueTrendQuery } from '@/lib/hooks/use-revenue-admin-query';
import { useAdsQuery } from '@/lib/hooks/use-ads-query';
import { RevenuePresenter } from './revenue-presenter';

export function RevenueContainer() {
  const { summary, restaurants, isLoading } = useRevenueAdminQuery();
  const { months, trend, isLoading: trendLoading } = useRevenueTrendQuery();
  const { ads: campaigns } = useAdsQuery();

  if (isLoading || !summary) return <div>Loading...</div>;

  const topRestaurants = [...restaurants]
    .filter((r) => r.status === 'active')
    .sort((a, b) => (b.adRevenue + b.subscriptionRevenue) - (a.adRevenue + a.subscriptionRevenue))
    .slice(0, 3);

  const recentCampaigns = [...campaigns]
    .sort((a, b) => (b.revenueJustsearch + b.revenueRestaurant) - (a.revenueJustsearch + a.revenueRestaurant))
    .slice(0, 5);

  // Use ACTUAL database values — backend already calculated revenueJustsearch/revenueRestaurant per event
  const restaurantBroughtRevenue = campaigns
    .filter((c) => c.type === 'restaurant_brought')
    .reduce((sum, c) => sum + c.revenueJustsearch + c.revenueRestaurant, 0);

  const platformBroughtRevenue = campaigns
    .filter((c) => c.type === 'platform')
    .reduce((sum, c) => sum + c.revenueJustsearch + c.revenueRestaurant, 0);

  const splitData = {
    restaurantBrought: {
      total: restaurantBroughtRevenue,
      // restaurant_brought: JustSearch 60%, Restaurant 40% (calculated by backend per event)
      platformShare: campaigns
        .filter((c) => c.type === 'restaurant_brought')
        .reduce((sum, c) => sum + c.revenueJustsearch, 0),
      restaurantShare: campaigns
        .filter((c) => c.type === 'restaurant_brought')
        .reduce((sum, c) => sum + c.revenueRestaurant, 0),
    },
    platformBrought: {
      total: platformBroughtRevenue,
      // platform: JustSearch 100%, Restaurant 0% (calculated by backend per event)
      platformShare: campaigns
        .filter((c) => c.type === 'platform')
        .reduce((sum, c) => sum + c.revenueJustsearch, 0),
      restaurantShare: campaigns
        .filter((c) => c.type === 'platform')
        .reduce((sum, c) => sum + c.revenueRestaurant, 0),
    },
  };

  return (
    <RevenuePresenter
      summary={summary}
      restaurants={restaurants}
      topRestaurants={topRestaurants}
      recentCampaigns={recentCampaigns}
      splitData={splitData}
      trendMonths={months}
      trendData={trend}
      trendLoading={trendLoading}
    />
  );
}
