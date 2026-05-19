import { RevenueStatsCards } from './revenue-stats-cards';
import { RevenueChart } from './revenue-chart';
import { RevenueRestaurantTable } from './revenue-restaurant-table';
import { RevenueTopRestaurants } from './revenue-top-restaurants';
import { RevenueAdSplit } from './revenue-ad-split';
import { RevenueCampaignList } from './revenue-campaign-list';
import type { RestaurantRevenue } from '@/lib/constants/revenue.constants';
import type { RevenueResponse } from '@/lib/hooks/use-revenue-admin-query';
import type { AdCampaign } from '@/lib/stores/ad-campaign-types';
import type { AdSplitData } from './types/revenue.types';

interface RevenuePresenterProps {
  summary: RevenueResponse;
  restaurants: RestaurantRevenue[];
  topRestaurants: RestaurantRevenue[];
  recentCampaigns: AdCampaign[];
  splitData: AdSplitData;
  trendMonths: string[];
  trendData: number[];
  trendLoading: boolean;
}

export function RevenuePresenter({
  summary,
  restaurants,
  topRestaurants,
  recentCampaigns,
  splitData,
  trendMonths,
  trendData,
  trendLoading,
}: RevenuePresenterProps) {
  return (
    <div className="space-y-6">
      <RevenueStatsCards summary={summary} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart months={trendMonths} trend={trendData} isLoading={trendLoading} />
        </div>
        <RevenueAdSplit splitData={splitData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueRestaurantTable restaurants={restaurants} />
        </div>
        <div className="space-y-6">
          <RevenueTopRestaurants restaurants={topRestaurants} />
          <RevenueCampaignList campaigns={recentCampaigns} />
        </div>
      </div>
    </div>
  );
}
