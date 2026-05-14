import type { AdCampaign } from "@/lib/stores/ad-campaign-types";

export interface RestaurantAdAnalytics {
  campaigns: AdCampaign[];
  totalRevenue: number;
  restaurantShare: number; // 60% of restaurant_brought + 40% of platform
  platformShare: number;
  totalImpressions: number;
  totalCompletions: number;
  totalSkips: number;
}

export function computeRestaurantAnalytics(campaigns: AdCampaign[]): RestaurantAdAnalytics {
  let totalRevenue = 0;
  let restaurantShare = 0;
  let platformShare = 0;
  let totalImpressions = 0;
  let totalCompletions = 0;
  let totalSkips = 0;

  campaigns.forEach((c) => {
    totalRevenue += c.revenue;
    totalImpressions += c.impressions;
    totalCompletions += c.completions;
    totalSkips += c.skips;

    if (c.type === "restaurant_brought") {
      restaurantShare += c.revenue * 0.6;
      platformShare += c.revenue * 0.4;
    } else {
      restaurantShare += c.revenue * 0.4;
      platformShare += c.revenue * 0.6;
    }
  });

  return {
    campaigns,
    totalRevenue,
    restaurantShare,
    platformShare,
    totalImpressions,
    totalCompletions,
    totalSkips,
  };
}
