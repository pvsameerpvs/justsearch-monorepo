"use client";

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface RestaurantCurrentResponse {
  id: string;
  slug: string;
  subdomain: string;
  name: string;
  status: string;
  theme?: Record<string, unknown>;
  settings?: {
    logoUrl?: string;
    heroImageUrl?: string;
    [key: string]: unknown;
  };
}

function getSlug(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('restaurant-slug');
}

async function fetchCurrentRestaurant(): Promise<RestaurantCurrentResponse | null> {
  try {
    return await apiClient('/restaurants/current');
  } catch {
    return null;
  }
}

export function useRestaurantQuery() {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    setSlug(getSlug());
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['currentRestaurant', slug],
    queryFn: fetchCurrentRestaurant,
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });

  return {
    restaurant: data ?? null,
    restaurantSlug: slug,
    logoUrl: data?.settings?.logoUrl || undefined,
    isLoading,
  };
}
