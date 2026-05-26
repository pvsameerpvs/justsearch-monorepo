"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DriverCurrentOrderCard } from "./driver-current-order-card";
import { DriverQueueSection } from "./driver-queue-section";
import { DriverCompletedSection } from "./driver-completed-section";
import { DriverRefreshButton } from "./driver-refresh-button";
import { DriverEmptyState } from "./driver-empty-state";
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
          <h1 className="text-lg font-bold text-slate-900">
            {current ? "Current delivery" : "No active delivery"}
          </h1>
          <p className="text-xs text-slate-500">
            {activeCount > 0 ? `${activeCount} order${activeCount > 1 ? "s" : ""} in your queue` : "Waiting for new orders"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {activeCount > 1 && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-100"
            >
              +{activeCount - 1} queued
            </motion.span>
          )}
          <DriverRefreshButton onRefresh={onRefresh} isRefreshing={isRefreshing} />
        </div>
      </div>

      {current ? (
        <DriverCurrentOrderCard order={current} onUpdateStatus={updateStatus} />
      ) : (
        <DriverEmptyState />
      )}

      <DriverQueueSection orders={orders} currentOrderId={current?.id ?? ""} />
      <DriverCompletedSection orders={orders} />
    </div>
  );
}
