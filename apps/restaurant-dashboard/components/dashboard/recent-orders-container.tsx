"use client";

import { useOrdersQuery } from "@/lib/hooks/use-orders-query";
import { RecentOrders } from "../recent-orders";

export function RecentOrdersContainer() {
  const { orders, isLoading, error, refetch } = useOrdersQuery();

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

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200/60 bg-red-50/80 backdrop-blur-xl p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]">
        <p className="text-sm font-bold text-red-700">{error}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-xs font-bold text-red-600 hover:text-red-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <RecentOrders orders={orders} />;
}
