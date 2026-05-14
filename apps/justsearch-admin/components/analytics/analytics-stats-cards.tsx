"use client";

import { useState, useEffect } from "react";

import {
  Store,
  Users,
  Trophy,
  DollarSign,
  Megaphone,
  ShoppingBag,
} from "lucide-react";

import type { AnalyticsSummary } from "@/lib/stores/analytics-store";

const STAT_META = [
  { label: "Restaurants", key: "totalRestaurants" as const, sub: "activeRestaurants" as const, icon: Store, gradient: "from-blue-500 to-sky-500", text: "text-blue-700" },
  { label: "Users", key: "totalUsers" as const, sub: "activeUsers" as const, icon: Users, gradient: "from-indigo-500 to-violet-500", text: "text-indigo-700" },
  { label: "Game Points", key: "totalGamePoints" as const, sub: "avgPointsPerUser" as const, icon: Trophy, gradient: "from-amber-500 to-orange-500", text: "text-amber-700" },
  { label: "Ad Revenue", key: "totalAdRevenue" as const, sub: "activeCampaigns" as const, icon: DollarSign, gradient: "from-emerald-500 to-teal-500", text: "text-emerald-700" },
  { label: "Campaigns", key: "totalCampaigns" as const, sub: "activeCampaigns" as const, icon: Megaphone, gradient: "from-purple-500 to-fuchsia-500", text: "text-purple-700" },
  { label: "Orders", key: "totalOrders" as const, sub: "totalViews" as const, icon: ShoppingBag, gradient: "from-rose-500 to-pink-500", text: "text-rose-700" },
];

function formatStatValue(key: keyof AnalyticsSummary, value: number): string {
  if (key === "totalAdRevenue") return `AED ${value.toLocaleString()}`;
  if (key === "totalGamePoints") return value.toLocaleString();
  return String(value);
}

function formatStatSubLabel(
  key: keyof AnalyticsSummary,
  subValue: number
): string {
  if (key === "totalCampaigns") return `${subValue} active`;
  if (key === "totalGamePoints") return `${subValue} avg/user`;
  if (key === "totalAdRevenue") return `${subValue} campaigns`;
  if (key === "totalOrders") return `${subValue.toLocaleString()} views`;
  return `${subValue} active`;
}

interface AnalyticsStatsCardsProps {
  summary: AnalyticsSummary;
}

export function AnalyticsStatsCards({ summary }: AnalyticsStatsCardsProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {STAT_META.map((s) => {
        const Icon = s.icon;
        const value = summary[s.key];
        const subValue = summary[s.sub];

        return (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-sm mb-3`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className={`text-xl font-black tracking-tight ${s.text}`}>
              {mounted ? formatStatValue(s.key, value) : "—"}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">
              {s.label}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {formatStatSubLabel(s.key, subValue)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
