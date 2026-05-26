"use client";

import { useOrdersQuery } from "@/lib/hooks/use-orders-query";
import { RecentOrders } from "../recent-orders";

export function RecentOrdersContainer() {
  const { orders, isLoading, error, refetch } = useOrdersQuery();

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

  if (error) {
    return (
      <div className="elegant-card p-5">
        <p className="text-sm font-semibold text-red-700">{error}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-xs font-semibold text-red-600 hover:text-red-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <RecentOrders orders={orders} />;
}
