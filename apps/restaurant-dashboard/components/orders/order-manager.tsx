"use client";

import { useState } from "react";
import { useOrderStore } from "@/lib/stores/order-store";
import { OrderListItem } from "./order-list-item";
import { Package } from "lucide-react";

const FILTERS = ["all", "pending", "active", "completed", "cancelled"] as const;

export function OrderManager() {
  const { orders } = useOrderStore();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const filtered = orders.filter((o) => {
    if (filter === "pending") return o.status === "pending";
    if (filter === "active") return !["completed", "cancelled"].includes(o.status);
    if (filter === "completed") return o.status === "completed";
    if (filter === "cancelled") return o.status === "cancelled";
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-all ${
              filter === f ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <Package className="h-6 w-6 text-emerald-500" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((order) => (
            <OrderListItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
