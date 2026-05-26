"use client";

import { useAnalyticsTopItemsQuery } from "@/lib/hooks/use-analytics-query";
import { TopMenuItems } from "../top-menu-items";

export function TopMenuItemsContainer() {
  const { data, isLoading, error } = useAnalyticsTopItemsQuery();

  if (isLoading) {
    return (
      <div className="elegant-card p-0 overflow-hidden">
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
      <div className="elegant-card p-5">
        <p className="text-sm font-semibold text-red-700">
          {error instanceof Error ? error.message : "Failed to load top items"}
        </p>
      </div>
    );
  }

  return <TopMenuItems items={data.topItems} />;
}
