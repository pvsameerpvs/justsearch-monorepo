import type { MonthlyDataPoint } from "@/lib/hooks/use-analytics-admin-query";
import type { RestaurantRevenue } from "@/lib/constants/revenue.constants";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";
import type { RestaurantUser } from "@/lib/types/user.types";

export interface DashboardStats {
  restaurants: number;
  activeRestaurants: number;
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalOrders: number;
  totalViews: number;
  activeCampaigns: number;
  totalCampaigns: number;
  totalImpressions: number;
  activeGames: number;
  totalGames: number;
  totalPoints: number;
}

export interface DashboardData {
  stats: DashboardStats;
  monthlyData: MonthlyDataPoint[];
  topRestaurants: RestaurantRevenue[];
  activeCampaigns: AdCampaign[];
  recentUsers: RestaurantUser[];
}
