'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface ApiRestaurant {
  id: string;
  slug: string;
  subdomain: string;
  name: string;
  status: string;
  createdAt: string;
  city?: string;
  area?: string;
  cuisine?: string;
  ownerName?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  taxNumber?: string;
  businessLicense?: string;
  licenseUrl?: string;
  photos?: string[];
  tables?: number;
  dashboardUsername?: string;
  dashboardPassword?: string;
}

const RESTAURANTS_KEY = ['restaurants'] as const;

async function fetchRestaurants(): Promise<ApiRestaurant[]> {
  const res = await apiClient<{ restaurants: ApiRestaurant[] }>('/restaurants');
  return res.restaurants;
}

export function useRestaurantsQuery() {
  const { data: restaurants = [], isLoading, error, refetch } = useQuery({
    queryKey: RESTAURANTS_KEY,
    queryFn: fetchRestaurants,
  });
  return { restaurants, isLoading, error, refetch };
}
