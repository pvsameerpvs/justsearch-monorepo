import type { RestaurantRevenue } from "@/lib/constants/revenue.constants";
import type { AdminRestaurant } from "@/lib/stores/restaurant-store";
import type { RestaurantUser } from "@/lib/stores/user-store";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";
import type { AnalyticsSummary } from "@/lib/stores/analytics-store";
import type { ComputedRestaurantRow, GameStat, AdStat } from "@/components/analytics/types/analytics.types";

export function computeRestaurantRows(
  revenueData: RestaurantRevenue[],
  restaurants: AdminRestaurant[],
  users: RestaurantUser[]
): ComputedRestaurantRow[] {
  return revenueData.map((r) => {
    const rs = restaurants.find((rs) => rs.id === r.id);
    const restaurantUsers = users.filter((u) => u.restaurantId === r.id);
    return {
      ...r,
      userCount: restaurantUsers.length,
      points: restaurantUsers.reduce((sum, u) => sum + u.totalPoints, 0),
      area: rs?.area ?? "",
    };
  });
}

export function computeGameStats(users: RestaurantUser[]): GameStat[] {
  const map = new Map<
    string,
    { gameId: string; gameName: string; totalPoints: number; playerIds: Set<string> }
  >();

  users.forEach((u) => {
    u.gamePoints.forEach((gp) => {
      const existing = map.get(gp.gameId);
      if (existing) {
        existing.totalPoints += gp.points;
        existing.playerIds.add(u.id);
      } else {
        map.set(gp.gameId, {
          gameId: gp.gameId,
          gameName: gp.gameName,
          totalPoints: gp.points,
          playerIds: new Set([u.id]),
        });
      }
    });
  });

  return Array.from(map.values())
    .map((g) => ({
      gameId: g.gameId,
      gameName: g.gameName,
      totalPoints: g.totalPoints,
      players: g.playerIds.size,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);
}

export function computeTopAdCampaigns(campaigns: AdCampaign[]): AdStat[] {
  return campaigns
    .map((c) => ({
      ...c,
      completionRate: c.impressions > 0 ? Math.round((c.completions / c.impressions) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

export function buildSummary(
  restaurants: AdminRestaurant[],
  users: RestaurantUser[],
  revenue: { summary: { totalOrders: number; totalViews: number } },
  campaigns: AdCampaign[]
): AnalyticsSummary {
  const activeUsers = users.filter((u) => u.status === "active").length;
  const totalPoints = users.reduce((sum, u) => sum + u.totalPoints, 0);

  return {
    totalRestaurants: restaurants.length,
    activeRestaurants: restaurants.filter((r) => r.status === "active").length,
    totalUsers: users.length,
    activeUsers,
    totalGamePoints: totalPoints,
    totalAdRevenue: campaigns.reduce((sum, c) => sum + c.revenue, 0),
    totalAdImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
    activeCampaigns: campaigns.filter((c) => c.isActive).length,
    totalCampaigns: campaigns.length,
    totalOrders: revenue.summary.totalOrders,
    totalViews: revenue.summary.totalViews,
    avgPointsPerUser: users.length > 0 ? Math.round(totalPoints / users.length) : 0,
  };
}
