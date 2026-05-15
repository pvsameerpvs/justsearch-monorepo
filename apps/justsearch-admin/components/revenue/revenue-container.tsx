'use client';

import { useRevenueAdminQuery } from '@/lib/hooks/use-revenue-admin-query';
import { useAdsQuery } from '@/lib/hooks/use-ads-query';
import { AD_SPLIT_RESTAURANT_BROUGHT, AD_SPLIT_PLATFORM_BROUGHT } from '@/lib/constants/revenue.constants';
import { RevenuePresenter } from './revenue-presenter';

export function RevenueContainer() {
  const { summary, restaurants, isLoading } = useRevenueAdminQuery();
  const { ads: campaigns } = useAdsQuery();

  if (isLoading || !summary) return <div>Loading...</div>;

  const topRestaurants = [...restaurants]
    .filter((r) => r.status === 'active')
    .sort((a, b) => (b.adRevenue + b.subscriptionRevenue) - (a.adRevenue + a.subscriptionRevenue))
    .slice(0, 3);

  const recentCampaigns = [...campaigns]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const restaurantBroughtRevenue = campaigns
    .filter((c) => c.type === 'restaurant_brought')
    .reduce((sum, c) => sum + c.revenue, 0);

  const platformBroughtRevenue = campaigns
    .filter((c) => c.type === 'platform')
    .reduce((sum, c) => sum + c.revenue, 0);

  const splitData = {
    restaurantBrought: {
      total: restaurantBroughtRevenue,
      restaurantShare: Math.round(restaurantBroughtRevenue * (AD_SPLIT_RESTAURANT_BROUGHT.restaurant / 100)),
      platformShare: Math.round(restaurantBroughtRevenue * (AD_SPLIT_RESTAURANT_BROUGHT.platform / 100)),
    },
    platformBrought: {
      total: platformBroughtRevenue,
      platformShare: Math.round(platformBroughtRevenue * (AD_SPLIT_PLATFORM_BROUGHT.platform / 100)),
      restaurantShare: Math.round(platformBroughtRevenue * (AD_SPLIT_PLATFORM_BROUGHT.restaurant / 100)),
    },
  };

  return (
    <RevenuePresenter
      summary={summary}
      restaurants={restaurants}
      topRestaurants={topRestaurants}
      recentCampaigns={recentCampaigns}
      splitData={splitData}
    />
  );
}
