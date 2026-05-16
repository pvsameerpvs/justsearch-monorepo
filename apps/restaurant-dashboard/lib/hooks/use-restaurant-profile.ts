"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { mapApiToAdminRestaurant } from "@/lib/utils/restaurant-profile.utils";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

const STALE_TIME = 5 * 60 * 1000;

async function fetchCurrentRestaurant(): Promise<AdminRestaurant> {
  const data = await apiClient<Record<string, unknown>>("/restaurants/current");
  return mapApiToAdminRestaurant(data);
}

async function patchCurrentRestaurant(
  updates: Partial<AdminRestaurant>
): Promise<AdminRestaurant> {
  const data = await apiClient<Record<string, unknown>>("/restaurants/current", {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  return mapApiToAdminRestaurant(data);
}

export function useRestaurantProfile() {
  const queryClient = useQueryClient();

  const {
    data: restaurant,
    isLoading,
    error,
  } = useQuery<AdminRestaurant, Error>({
    queryKey: ["restaurant", "profile"],
    queryFn: fetchCurrentRestaurant,
    staleTime: STALE_TIME,
    retry: 1,
  });

  const mutation = useMutation<AdminRestaurant, Error, Partial<AdminRestaurant>>({
    mutationFn: patchCurrentRestaurant,
    onSuccess: (updated) => {
      queryClient.setQueryData(["restaurant", "profile"], updated);
    },
  });

  const updateRestaurant = useCallback(
    async (updates: Partial<AdminRestaurant>) => {
      await mutation.mutateAsync(updates);
    },
    [mutation]
  );

  return {
    restaurant: restaurant ?? null,
    isLoading,
    error: error ?? null,
    updateRestaurant,
  };
}
