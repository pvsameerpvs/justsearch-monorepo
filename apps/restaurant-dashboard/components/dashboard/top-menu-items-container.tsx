"use client";

import { useAnalyticsTopItemsQuery } from "@/lib/hooks/use-analytics-query";
import { TopMenuItems } from "../top-menu-items";

export function TopMenuItemsContainer() {
  const { data, isLoading, error } = useAnalyticsTopItemsQuery();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]">
        <div className="p-5 pb-0">
          <div className="h-10 w-48 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="p-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 w-full bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200/60 bg-red-50/80 backdrop-blur-xl p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]">
        <p className="text-sm font-bold text-red-700">
          {error instanceof Error ? error.message : "Failed to load top items"}
        </p>
      </div>
    );
  }

  return <TopMenuItems items={data.topItems} />;
}
