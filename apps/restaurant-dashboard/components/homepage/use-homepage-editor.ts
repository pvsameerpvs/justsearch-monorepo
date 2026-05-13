import { useState } from "react";
import type { Restaurant } from "@justsearch/utils";

export function useHomepageEditor(restaurant: Restaurant) {
  const [heroUrl, setHeroUrl] = useState(restaurant.heroImageUrl ?? "");
  const [logoUrl, setLogoUrl] = useState(restaurant.logoUrl ?? "");
  const [name, setName] = useState(restaurant.name);
  const [tagline, setTagline] = useState(restaurant.tagline);
  const [category, setCategory] = useState(restaurant.category);
  const [cuisine, setCuisine] = useState(restaurant.cuisine.join(", "));
  const [hours, setHours] = useState(restaurant.openingHours.find((h) => h.isToday)?.hours ?? restaurant.openingHours[0]?.hours ?? "");

  const hasChanges =
    heroUrl !== (restaurant.heroImageUrl ?? "") ||
    logoUrl !== (restaurant.logoUrl ?? "") ||
    name !== restaurant.name ||
    tagline !== restaurant.tagline ||
    category !== restaurant.category ||
    cuisine !== restaurant.cuisine.join(", ") ||
    hours !== (restaurant.openingHours.find((h) => h.isToday)?.hours ?? restaurant.openingHours[0]?.hours ?? "");

  const buildUpdate = (): Partial<Restaurant> => ({
    heroImageUrl: heroUrl || undefined,
    logoUrl: logoUrl || undefined,
    name, tagline, category,
    cuisine: cuisine.split(",").map((c) => c.trim()).filter(Boolean),
    openingHours: restaurant.openingHours.map((h) => h.isToday ? { ...h, hours } : h),
  });

  const reset = () => {
    setHeroUrl(restaurant.heroImageUrl ?? "");
    setLogoUrl(restaurant.logoUrl ?? "");
    setName(restaurant.name);
    setTagline(restaurant.tagline);
    setCategory(restaurant.category);
    setCuisine(restaurant.cuisine.join(", "));
    setHours(restaurant.openingHours.find((h) => h.isToday)?.hours ?? restaurant.openingHours[0]?.hours ?? "");
  };

  return {
    heroUrl, setHeroUrl,
    logoUrl, setLogoUrl,
    name, setName,
    tagline, setTagline,
    category, setCategory,
    cuisine, setCuisine,
    hours, setHours,
    hasChanges,
    buildUpdate,
    reset,
  };
}
