import { AnalyticsStatsCards } from "./analytics-stats-cards";
import { AnalyticsRevenueChart } from "./analytics-revenue-chart";
import { AnalyticsTopRestaurants } from "./analytics-top-restaurants";
import { AnalyticsTopGames } from "./analytics-top-games";
import { AnalyticsAdPerformance } from "./analytics-ad-performance";

import type { AnalyticsResponse, MonthlyDataPoint } from "@/lib/hooks/use-analytics-admin-query";
import type { ComputedRestaurantRow, GameStat, AdStat } from "./types/analytics.types";

interface AnalyticsPresenterProps {
  summary: AnalyticsResponse;
  monthlyData: MonthlyDataPoint[];
  topRestaurants: ComputedRestaurantRow[];
  gameStats: GameStat[];
  adStats: AdStat[];
}

export function AnalyticsPresenter({
  summary,
  monthlyData,
  topRestaurants,
  gameStats,
  adStats,
}: AnalyticsPresenterProps) {
  return (
    <div className="space-y-5">
      <AnalyticsStatsCards summary={summary} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <AnalyticsRevenueChart data={monthlyData} />
        </div>
        <AnalyticsTopGames gameStats={gameStats} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AnalyticsTopRestaurants restaurants={topRestaurants} />
        <AnalyticsAdPerformance campaigns={adStats} />
      </div>
    </div>
  );
}
