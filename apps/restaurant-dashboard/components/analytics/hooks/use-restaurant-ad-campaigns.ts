"use client";

import { useState, useEffect } from "react";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";

const STORAGE_KEY = "ad-campaign-store";

function readCampaigns(): AdCampaign[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.state?.campaigns ?? [];
  } catch {
    return [];
  }
}

export function useRestaurantAdCampaigns(restaurantId: string) {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);

  useEffect(() => {
    const all = readCampaigns();
    const filtered = all.filter(
      (c) => c.restaurantId === restaurantId || c.type === "platform"
    );
    setCampaigns(filtered);
  }, [restaurantId]);

  return campaigns;
}
