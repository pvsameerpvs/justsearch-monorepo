import { useMemo } from "react";

import { useRestaurantStore } from "@/lib/stores/restaurant-store";
import { useUserStore } from "@/lib/stores/user-store";
import { useRevenueStore } from "@/lib/stores/revenue-store";
import { useAdCampaignStore } from "@/lib/stores/ad-campaign-store";
import { useGameStore } from "@/lib/stores/game-store";
import { useAnalyticsStore } from "@/lib/stores/analytics-store";

import type { DashboardData } from "@/components/dashboard/types/dashboard-types";

export function useDashboardData(): DashboardData {
  const restaurants = useRestaurantStore((s) => s.restaurants);
  const { users } = useUserStore();
  const revenue = useRevenueStore();
  const campaigns = useAdCampaignStore((s) => s.campaigns);
  const { games } = useGameStore();
  const { monthlyData } = useAnalyticsStore();

  const stats = useMemo(
    () => ({
      restaurants: restaurants.length,
      activeRestaurants: restaurants.filter((r) => r.status === "active").length,
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === "active").length,
      totalRevenue: revenue.summary.totalRevenue,
      totalOrders: revenue.summary.totalOrders,
      totalViews: revenue.summary.totalViews,
      activeCampaigns: campaigns.filter((c) => c.isActive).length,
      totalCampaigns: campaigns.length,
      totalImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
      activeGames: games.filter((g) => g.isAvailable).length,
      totalGames: games.length,
      totalPoints: users.reduce((sum, u) => sum + u.totalPoints, 0),
    }),
    [restaurants, users, revenue, campaigns, games]
  );

  const topRestaurants = useMemo(
    () =>
      [...revenue.restaurants]
        .sort((a, b) => b.adRevenue + b.subscriptionRevenue - (a.adRevenue + a.subscriptionRevenue))
        .slice(0, 4),
    [revenue]
  );

  const activeCampaigns = useMemo(
    () => campaigns.filter((c) => c.isActive).slice(0, 4),
    [campaigns]
  );

  const recentUsers = useMemo(() => users.slice(0, 5), [users]);

  return { stats, monthlyData, topRestaurants, activeCampaigns, recentUsers };
}
