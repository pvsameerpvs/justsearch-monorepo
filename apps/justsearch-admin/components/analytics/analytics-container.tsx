"use client";

import { useMemo } from "react";

import { useRestaurantStore } from "@/lib/stores/restaurant-store";
import { useUserStore } from "@/lib/stores/user-store";
import { useRevenueStore } from "@/lib/stores/revenue-store";
import { useAdCampaignStore } from "@/lib/stores/ad-campaign-store";
import { useAnalyticsStore } from "@/lib/stores/analytics-store";

import {
  buildSummary,
  computeRestaurantRows,
  computeGameStats,
  computeTopAdCampaigns,
} from "@/lib/utils/analytics.utils";

import { AnalyticsPresenter } from "./analytics-presenter";

export function AnalyticsContainer() {
  const restaurants = useRestaurantStore((s) => s.restaurants);
  const { users } = useUserStore();
  const revenue = useRevenueStore();
  const campaigns = useAdCampaignStore((s) => s.campaigns);
  const { monthlyData } = useAnalyticsStore();

  const summary = useMemo(
    () => buildSummary(restaurants, users, revenue, campaigns),
    [restaurants, users, revenue, campaigns]
  );

  const restaurantRows = useMemo(
    () => computeRestaurantRows(revenue.restaurants, restaurants, users),
    [revenue, restaurants, users]
  );

  const topRestaurants = useMemo(
    () =>
      [...restaurantRows]
        .sort((a, b) => b.adRevenue + b.subscriptionRevenue - (a.adRevenue + a.subscriptionRevenue))
        .slice(0, 5),
    [restaurantRows]
  );

  const gameStats = useMemo(() => computeGameStats(users), [users]);
  const adStats = useMemo(() => computeTopAdCampaigns(campaigns), [campaigns]);

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
