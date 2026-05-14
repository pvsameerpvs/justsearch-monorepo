"use client";

import { useState, useEffect, useMemo } from "react";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";
import { computeRestaurantAnalytics } from "@/lib/stores/ad-analytics-utils";
import { AdPerformanceStats } from "./ad-performance-stats";
import { AdPerformanceTable } from "./ad-performance-table";
import { AdRevenueSplit } from "./ad-revenue-split";

const STORAGE_KEY = "ad-campaign-store";

const DEMO_CAMPAIGNS: AdCampaign[] = [
  {
    id: "demo-1",
    title: "Summer Fragrance Collection",
    clientName: "Ahmed Al-Rashid",
    companyName: "Desert Bloom Perfumes",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=100&h=100&fit=crop",
    duration: 15,
    type: "restaurant_brought",
    restaurantId: "mosaic-table",
    restaurantName: "Mosaic Table",
    assignedGames: ["1", "2"],
    isActive: true,
    impressions: 3420,
    skips: 890,
    completions: 2530,
    revenue: 12650,
    createdAt: "2026-04-13",
  },
  {
    id: "demo-2",
    title: "Luxury Watch Flash Sale",
    clientName: "Fatima Hassan",
    companyName: "Golden Hour Watches",
    mediaType: "gif",
    mediaUrl: "",
    duration: 20,
    type: "restaurant_brought",
    restaurantId: "mosaic-table",
    restaurantName: "Mosaic Table",
    assignedGames: ["1"],
    isActive: true,
    impressions: 2150,
    skips: 520,
    completions: 1630,
    revenue: 8150,
    createdAt: "2026-04-23",
  },
  {
    id: "demo-3",
    title: "Coca-Cola Summer Vibes",
    clientName: "Coca-Cola ME",
    companyName: "Coca-Cola Middle East",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&h=100&fit=crop",
    duration: 10,
    type: "platform",
    restaurantId: null,
    restaurantName: null,
    assignedGames: ["1", "2", "3", "4", "5"],
    isActive: true,
    impressions: 12500,
    skips: 3100,
    completions: 9400,
    revenue: 47000,
    createdAt: "2026-03-29",
  },
  {
    id: "demo-4",
    title: "Dubai Fitness Challenge",
    clientName: "Fitness First UAE",
    companyName: "Fitness First",
    mediaType: "video",
    mediaUrl: "",
    duration: 18,
    type: "platform",
    restaurantId: null,
    restaurantName: null,
    assignedGames: ["3", "4"],
    isActive: false,
    impressions: 8900,
    skips: 2400,
    completions: 6500,
    revenue: 32500,
    createdAt: "2026-03-14",
  },
  {
    id: "demo-5",
    title: "Organic Skincare Launch",
    clientName: "Priya Nair",
    companyName: "Glow Naturally",
    mediaType: "video",
    mediaUrl: "",
    duration: 12,
    type: "restaurant_brought",
    restaurantId: "spice-route",
    restaurantName: "Spice Route",
    assignedGames: ["2", "3"],
    isActive: true,
    impressions: 1890,
    skips: 430,
    completions: 1460,
    revenue: 5840,
    createdAt: "2026-04-28",
  },
];

function readCampaigns(): AdCampaign[] {
  if (typeof window === "undefined") return DEMO_CAMPAIGNS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEMO_CAMPAIGNS;
    const parsed = JSON.parse(raw);
    const stored = parsed.state?.campaigns ?? [];
    return stored.length > 0 ? stored : DEMO_CAMPAIGNS;
  } catch {
    return DEMO_CAMPAIGNS;
  }
}

export function AdAnalyticsContainer() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);

  useEffect(() => {
    const all = readCampaigns();
    // Filter: ONLY show campaigns for this restaurant OR platform-wide
    // NEVER show competitor restaurant ads
    const filtered = all.filter(
      (c) => c.type === "platform" || c.restaurantId === "mosaic-table"
    );
    setCampaigns(filtered);
  }, []);

  const analytics = useMemo(() => computeRestaurantAnalytics(campaigns), [campaigns]);

  return (
    <div className="space-y-5">
      <AdPerformanceStats analytics={analytics} />
      <AdRevenueSplit analytics={analytics} />
      <AdPerformanceTable campaigns={campaigns} />
    </div>
  );
}
