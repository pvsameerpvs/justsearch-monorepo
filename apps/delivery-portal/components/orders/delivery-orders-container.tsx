"use client";

import { useState } from "react";
import { PageHeader } from "@justsearch/ui";
import { DeliveryPortalShell } from "@/components/layout/delivery-portal-shell";
import { DeliveryOrderDetail } from "@/components/orders/delivery-order-detail";
import { DeliveryOrderListCard } from "@/components/orders/delivery-order-list-card";
import { getDeliveryPortalSnapshotBySlug } from "@/lib/mock-delivery-data";
import type { DeliveryOrder, DeliveryOrderStatus } from "@/lib/delivery-types";
import { Package } from "lucide-react";

const STATUS_FLOW: DeliveryOrderStatus[] = ["assigned", "picked_up", "on_route", "arrived", "delivered"];

function getNextStatus(current: DeliveryOrderStatus): DeliveryOrderStatus | null {
  const idx = STATUS_FLOW.indexOf(current);
  return STATUS_FLOW[idx + 1] ?? null;
}

const snapshot = getDeliveryPortalSnapshotBySlug("mosaic-table");

export function DeliveryOrdersContainer() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([...snapshot.activeOrders, ...snapshot.completedOrders]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const updateStatus = (orderId: string, status: DeliveryOrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  return (
    <DeliveryPortalShell restaurant={snapshot.restaurant} agent={snapshot.agent} routeHealthLabel={snapshot.routeHealthLabel}>
      <PageHeader title="My Orders" description="All assigned deliveries" />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(400px,1.2fr)]">
        <div className="space-y-3">
          {orders.map((order) => (
            <DeliveryOrderListCard
              key={order.id}
              order={order}
              isSelected={selectedOrderId === order.id}
              onSelect={() => setSelectedOrderId(order.id)}
              onNext={() => {
                const next = getNextStatus(order.status);
                if (next) updateStatus(order.id, next);
              }}
            />
          ))}
        </div>

        <div>
          {selectedOrder ? (
            <DeliveryOrderDetail order={selectedOrder} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 py-20">
              <Package className="h-12 w-12 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-500">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </DeliveryPortalShell>
  );
}
