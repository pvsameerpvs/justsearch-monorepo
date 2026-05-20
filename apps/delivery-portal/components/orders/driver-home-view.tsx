"use client";

import { useState, useEffect } from "react";
import { Truck } from "lucide-react";
import { DriverCurrentOrderCard } from "./driver-current-order-card";
import { DriverQueueSection } from "./driver-queue-section";
import { DriverCompletedSection } from "./driver-completed-section";
import { DriverRefreshButton } from "./driver-refresh-button";
import { sortOrdersByUrgency } from "./driver-queue-utils";
import { useUpdateDeliveryStatus } from "@/lib/hooks/use-update-delivery-status";
import type { DeliveryOrder } from "@/lib/delivery-types";

type DriverHomeViewProps = {
  orders: DeliveryOrder[];
  onRefresh: () => void;
  isRefreshing: boolean;
};

export function DriverHomeView({ orders: initialOrders, onRefresh, isRefreshing }: DriverHomeViewProps) {
  const [orders, setOrders] = useState<DeliveryOrder[]>(initialOrders);
  const { mutate: updateStatusApi } = useUpdateDeliveryStatus();

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const updateStatus = (assignmentId: string, status: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.assignmentId === assignmentId
          ? { ...o, status: status === 'in_transit' ? 'on_route' : (status as DeliveryOrder['status']) }
          : o
      )
    );
    updateStatusApi({ assignmentId, status });
  };

  const activeOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
  const sorted = sortOrdersByUrgency(activeOrders);
  const current = sorted[0] ?? null;
  const activeCount = activeOrders.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">{current ? "Current delivery" : "No active delivery"}</h1>
          <p className="text-xs text-slate-500">
            {activeCount > 0 ? `${activeCount} order${activeCount > 1 ? "s" : ""} in your queue` : "Waiting for new orders"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {activeCount > 1 && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-100">
              +{activeCount - 1} queued
            </span>
          )}
          <DriverRefreshButton onRefresh={onRefresh} isRefreshing={isRefreshing} />
        </div>
      </div>

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

      <DriverQueueSection orders={orders} currentOrderId={current?.id ?? ""} />
      <DriverCompletedSection orders={orders} />
    </div>
  );
}
