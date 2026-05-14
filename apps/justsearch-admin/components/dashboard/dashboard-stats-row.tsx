"use client";

import { useState, useEffect } from "react";

import { DASHBOARD_STAT_META } from "@/components/dashboard/constants/dashboard-constants";
import type { DashboardStats } from "@/components/dashboard/types/dashboard-types";
import type { StatMetaItem } from "@/components/dashboard/constants/dashboard-constants";

function formatStatValue(item: StatMetaItem, value: number): string {
  if (item.key === "totalRevenue") return `AED ${value.toLocaleString()}`;
  return value.toLocaleString();
}

interface DashboardStatCardProps {
  item: StatMetaItem;
  value: number;
  subValue: number;
  mounted: boolean;
}

function DashboardStatCard({ item, value, subValue, mounted }: DashboardStatCardProps) {
  const Icon = item.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-sm mb-3`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className={`text-xl font-black tracking-tight ${item.text}`}>
        {mounted ? formatStatValue(item, value) : "—"}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">{item.label}</p>
      <p className="text-[10px] text-slate-400 mt-0.5">{subValue.toLocaleString()} {item.subLabel}</p>
    </div>
  );
}

interface DashboardStatsRowProps {
  stats: DashboardStats;
}

export function DashboardStatsRow({ stats }: DashboardStatsRowProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {DASHBOARD_STAT_META.map((item) => (
        <DashboardStatCard
          key={item.label}
          item={item}
          value={stats[item.key]}
          subValue={stats[item.subKey]}
          mounted={mounted}
        />
      ))}
    </div>
  );
}
