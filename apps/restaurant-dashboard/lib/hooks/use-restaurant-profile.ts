"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { mapApiToAdminRestaurant } from "@/lib/utils/restaurant-profile.utils";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

export function useRestaurantProfile() {
  const [restaurant, setRestaurant] = useState<AdminRestaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await apiClient<Record<string, unknown>>("/restaurants/current");
        if (!cancelled) {
          setRestaurant(mapApiToAdminRestaurant(data));
        }
      } catch {
        if (!cancelled) setRestaurant(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const updateRestaurant = useCallback(
    async (updates: Partial<AdminRestaurant>) => {
      setRestaurant((prev) => {
        if (!prev) return prev;
        return { ...prev, ...updates };
      });
      try {
        const response = await apiClient<Record<string, unknown>>("/restaurants/current", {
          method: "PATCH",
          body: JSON.stringify(updates),
        });
        setRestaurant(mapApiToAdminRestaurant(response));
      } catch {
        // Revert on error is optional; for now keep optimistic update
      }
    },
    []
  );

  return { restaurant, isLoading, updateRestaurant };
}
