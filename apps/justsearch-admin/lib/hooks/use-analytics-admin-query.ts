'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface MonthlyDataPoint {
  month: string;
  revenue: number;
  users: number;
  restaurants: number;
  orders: number;
}

export interface AnalyticsResponse {
  totalRestaurants: number;
  activeRestaurants: number;
  totalUsers: number;
  activeUsers: number;
  totalGamePoints: number;
  totalAdRevenue: number;
  totalAdImpressions: number;
  activeCampaigns: number;
  totalCampaigns: number;
  totalOrders: number;
  totalViews: number;
  avgPointsPerUser: number;
  monthlyData: MonthlyDataPoint[];
}

const ANALYTICS_KEY = ['analytics-summary'] as const;

async function fetchAnalytics(): Promise<AnalyticsResponse> {
  return apiClient<AnalyticsResponse>('/analytics/admin/summary');
}

export function useAnalyticsAdminQuery() {
  const { data, isLoading, error } = useQuery({
    queryKey: ANALYTICS_KEY,
    queryFn: fetchAnalytics,
  });
  return { analytics: data ?? null, isLoading, error };
}
