"use client";

import { useState, useEffect, useCallback } from "react";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

const STORAGE_KEY = "justsearch-admin-restaurants";

function getSlugFromHostname(): string {
  if (typeof window === "undefined") return "mosaic-table";
  const host = window.location.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1") {
    return "mosaic-table";
  }
  if (host.startsWith("admin-")) {
    return host.replace("admin-", "").split(".")[0];
  }
  return host.split(".")[0];
}

const DEMO_RESTAURANTS: AdminRestaurant[] = [
  {
    id: "1",
    name: "Mosaic Table",
    slug: "mosaic-table",
    subdomain: "mosaic-table",
    city: "Dubai",
    area: "Marina",
    status: "active",
    createdAt: "2024-01-15",
    tables: 10,
    ownerName: "Ahmed Al-Rashid",
    contactPhone: "+971 50 123 4567",
    contactEmail: "ahmed@mosaictable.ae",
    address: "Dubai Marina, Tower A, Floor 2",
    cuisine: "Mediterranean",
    taxNumber: "TRN-123456789",
    businessLicense: "BL-987654321",
    licenseUrl: "",
    photos: [],
    dashboardUsername: "js",
    dashboardPassword: "1234",
  },
];

function loadRestaurants(): AdminRestaurant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEMO_RESTAURANTS;
    const parsed = JSON.parse(raw);
    const list = parsed.state?.restaurants ?? [];
    return list.length > 0 ? list : DEMO_RESTAURANTS;
  } catch {
    return DEMO_RESTAURANTS;
  }
}

function saveRestaurants(restaurants: AdminRestaurant[]) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const parsed = JSON.parse(raw);
  parsed.state.restaurants = restaurants;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

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
