"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getSlugFromHostname,
  loadRestaurants,
  saveRestaurants,
} from "./use-restaurant-profile.data";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

export function useRestaurantProfile() {
  const [restaurant, setRestaurant] = useState<AdminRestaurant | null>(null);
  const slug = getSlugFromHostname();

  const load = useCallback(() => {
    const restaurants = loadRestaurants();
    const found = restaurants.find((r) => r.slug === slug || r.subdomain === slug);
    if (found) setRestaurant(found);
    else setRestaurant(null);
  }, [slug]);

  useEffect(() => {
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, [load]);

  const updateRestaurant = useCallback(
    (updates: Partial<AdminRestaurant>) => {
      const restaurants = loadRestaurants();
      const idx = restaurants.findIndex((r) => r.slug === slug || r.subdomain === slug);
      if (idx === -1) return;
      const updated = { ...restaurants[idx], ...updates };
      restaurants[idx] = updated;
      saveRestaurants(restaurants);
      setRestaurant(updated);
    },
    [slug]
  );

  return { restaurant, updateRestaurant };
}
