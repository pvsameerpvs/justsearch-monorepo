"use client";

import { useAnalyticsSummaryQuery } from "@/lib/hooks/use-analytics-query";
import { DashboardStats } from "../dashboard-stats";

export function StatsContainer() {
  const { data: summary, isLoading, error } = useAnalyticsSummaryQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-100 bg-white p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-slate-200 animate-pulse" />
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
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm font-semibold text-red-700">
          {error instanceof Error ? error.message : "Failed to load stats"}
        </p>
      </div>
    );
  }

  return <DashboardStats summary={summary} />;
}
