"use client";

import { useAnalyticsSummaryQuery } from "@/lib/hooks/use-analytics-query";
import { DashboardStats } from "../dashboard-stats";

export function StatsContainer() {
  const { data: summary, isLoading, error } = useAnalyticsSummaryQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl p-5 space-y-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between">
              <div className="h-11 w-11 rounded-xl bg-slate-200 animate-pulse" />
              <div className="h-6 w-16 rounded-full bg-slate-200 animate-pulse" />
            </div>
            <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="rounded-2xl border border-red-200/60 bg-red-50/80 backdrop-blur-xl p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]">
        <p className="text-sm font-bold text-red-700">
          {error instanceof Error ? error.message : "Failed to load stats"}
        </p>
      </div>
    );
  }

  return <DashboardStats summary={summary} />;
}
