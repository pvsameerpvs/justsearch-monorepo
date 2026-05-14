"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import { DriverCurrentOrderCard } from "./driver-current-order-card";
import { DriverQueueSection } from "./driver-queue-section";
import { DriverCompletedSection } from "./driver-completed-section";
import { sortOrdersByUrgency } from "./driver-queue-utils";
import type { DeliveryOrder, DeliveryOrderStatus } from "@/lib/delivery-types";

type DriverHomeViewProps = {
  orders: DeliveryOrder[];
};

export function DriverHomeView({ orders: initialOrders }: DriverHomeViewProps) {
  const [orders, setOrders] = useState<DeliveryOrder[]>(initialOrders);

  const updateStatus = (orderId: string, status: DeliveryOrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const sorted = sortOrdersByUrgency(orders);
  const current = sorted.find((o) => o.status !== "delivered");
  const activeCount = orders.filter((o) => o.status !== "delivered").length;

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            {current ? "Current delivery" : "No active delivery"}
          </h1>
          <p className="text-xs text-slate-500">
            {activeCount > 0 ? `${activeCount} order${activeCount > 1 ? "s" : ""} in your queue` : "Waiting for new orders"}
          </p>
        </div>
        {activeCount > 1 && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-100">
            +{activeCount - 1} queued
          </span>
        )}
      </div>

      {/* Current order or empty state */}
      {current ? (
        <DriverCurrentOrderCard order={current} onUpdateStatus={updateStatus} />
      ) : (
        <div className="rounded-[20px] border border-dashed border-slate-300 bg-white p-8 text-center">
          <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <Truck className="h-7 w-7 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No active delivery</p>
          <p className="text-xs text-slate-500 mt-1">New orders will appear here</p>
        </div>
      )}

      {/* Queue - just info, no navigation */}
      <DriverQueueSection
        orders={orders}
        currentOrderId={current?.id ?? ""}
      />

      {/* Completed */}
      <DriverCompletedSection orders={orders} />
    </div>
  );
}
