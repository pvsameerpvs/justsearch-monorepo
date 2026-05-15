"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

export interface ApiRestaurant {
  id: string;
  slug: string;
  subdomain: string;
  name: string;
  status: string;
  createdAt: string;
}

export function useRestaurantsQuery() {
  const [restaurants, setRestaurants] = useState<ApiRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient<{ restaurants: ApiRestaurant[] }>("/restaurants");
      setRestaurants(res.restaurants);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return { restaurants, isLoading, error, refetch: fetchRestaurants };
}
