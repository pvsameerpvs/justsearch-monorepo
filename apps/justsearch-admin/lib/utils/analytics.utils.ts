import type { RestaurantRevenue } from "@/lib/constants/revenue.constants";
import type { ApiRestaurant } from "@/lib/hooks/use-restaurants-query";
import type { AdminUser } from "@/lib/hooks/use-users-admin-query";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";
import type { ComputedRestaurantRow, GameStat, AdStat } from "@/components/analytics/types/analytics.types";

export function computeRestaurantRows(
  revenueData: RestaurantRevenue[],
  restaurants: ApiRestaurant[],
  users: AdminUser[]
): ComputedRestaurantRow[] {
  return revenueData.map((r) => {
    const rs = restaurants.find((rs) => rs.id === r.id);
    const restaurantUsers = users.filter((u) => u.restaurantId === r.id);
    return {
      ...r,
      userCount: restaurantUsers.length,
      points: 0,
      area: rs?.area ?? "",
    };
  });
}

export function computeGameStats(): GameStat[] {
  return [];
}

export function computeTopAdCampaigns(campaigns: AdCampaign[]): AdStat[] {
  return campaigns
    .map((c) => ({
      ...c,
      completionRate: c.totalViewsFull > 0 ? Math.round((c.totalConfirmedClicks / c.totalViewsFull) * 100) : 0,
      completions: c.totalConfirmedClicks,
    }))
    .sort((a, b) => (b.revenueJustsearch + b.revenueRestaurant) - (a.revenueJustsearch + a.revenueRestaurant))
    .slice(0, 5);
}
