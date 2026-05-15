'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface RevenueResponse {
  totalRevenue: number;
  adRevenue: number;
  subscriptionRevenue: number;
  activeRestaurants: number;
  totalOrders: number;
  totalViews: number;
  avgRevenuePerRestaurant: number;
  growthPercent: number;
  restaurants: Array<{
    id: string;
    name: string;
    city: string;
    status: 'active' | 'draft' | 'suspended';
    orders: number;
    views: number;
    adRevenue: number;
    subscriptionRevenue: number;
    platformFee: number;
  }>;
}

const REVENUE_KEY = ['revenue'] as const;

async function fetchRevenue(): Promise<RevenueResponse> {
  return apiClient<RevenueResponse>('/revenue');
}

export function useRevenueAdminQuery() {
  const { data, isLoading, error } = useQuery({
    queryKey: REVENUE_KEY,
    queryFn: fetchRevenue,
  });
  return {
    summary: data ?? null,
    restaurants: data?.restaurants ?? [],
    isLoading,
    error,
  };
}
