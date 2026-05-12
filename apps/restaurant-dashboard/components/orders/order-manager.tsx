"use client";

import { useState } from "react";
import { useOrderStore } from "@/lib/stores/order-store";
import { Check, X } from "lucide-react";
import { ORDER_FLOW, OrderStatusBadge } from "./order-status-config";

export function OrderManager() {
  const { orders, updateStatus } = useOrderStore();
  const [filter, setFilter] = useState<"all" | "pending" | "active">("all");

  const filtered = orders.filter((o) => {
    if (filter === "pending") return o.status === "pending";
    if (filter === "active") return o.status !== "completed" && o.status !== "cancelled";
    return true;
  });

  const nextStatus = (id: string, current: string) => {
    const idx = ORDER_FLOW.findIndex((s) => s.value === current);
    const next = ORDER_FLOW[idx + 1]?.value;
    if (next) updateStatus(id, next as never);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(["all", "pending", "active"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-all ${
              filter === f ? "bg-slate-900 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((order) => (
          <div key={order.id} className="elegant-card p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{order.code}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="mt-1 text-sm text-slate-600">{order.customerName}</p>
                <p className="text-xs text-slate-400">{order.items} items · AED {order.total}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {order.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => updateStatus(order.id, "cancelled")}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(order.id, "confirmed")}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm hover:bg-emerald-600"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </>
                )}
                {order.status !== "pending" && order.status !== "completed" && order.status !== "cancelled" && (
                  <button
                    type="button"
                    onClick={() => nextStatus(order.id, order.status)}
                    className="elegant-btn-primary text-xs"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
