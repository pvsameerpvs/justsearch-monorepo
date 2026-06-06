"use client";

import { OrderManagerGrid } from "./order-manager-grid";
import { OrderSkeleton } from "./order-skeleton";
import { OrderError } from "./order-error";
import type { DashboardOrder } from "@/lib/stores/order-store";
import type { OrderStatus } from "@/lib/stores/order-store";

interface OrderManagerContentProps {
  orders: DashboardOrder[];
  isActiveTab: boolean;
  isLoading: boolean;
  error: string | null;
  pendingOrderIds: Set<string>;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onAdvance: (id: string, status: string, type: string) => void;
  onAssign: (id: string) => void;
  onView: (id: string) => void;
  onRetry: () => void;
  getNextStatus: (status: string, type: string) => OrderStatus | null;
}

export function OrderManagerContent({
  orders, isActiveTab, isLoading, error, pendingOrderIds,
  onAccept, onReject, onAdvance, onAssign, onView, onRetry, getNextStatus,
}: OrderManagerContentProps) {
  if (isLoading) return <OrderSkeleton />;
  if (error) return <OrderError message={error} onRetry={onRetry} />;

  return (
    <OrderManagerGrid
      orders={orders}
      isActiveTab={isActiveTab}
      pendingOrderIds={pendingOrderIds}
      onAccept={onAccept}
      onReject={onReject}
      onAdvance={(id, status, type) => {
        const next = getNextStatus(status, type);
        if (next) onAdvance(id, status, type);
      }}
      onAssign={onAssign}
      onView={onView}
    />
  );
}
