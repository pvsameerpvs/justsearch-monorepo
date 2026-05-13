"use client";

import { useOrderStore } from "@/lib/stores/order-store";
import { useDeliveryBoyStore } from "@/lib/stores/delivery-boy-store";
import { OrderDetailDrawer } from "@/components/orders/order-detail-drawer";
import { DeliveryBoyOrdersTable } from "./delivery-boy-orders-table";
import { DriverOrderDateFilter } from "./driver-order-date-filter";
import { DriverLifetimeStats } from "./driver-lifetime-stats";
import { DriverPeriodStats } from "./driver-period-stats";
import { OrdersDrawerHeader } from "./orders-drawer-header";
import { useDriverOrderFilter } from "./use-driver-order-filter";
import { useState } from "react";

interface DeliveryBoyOrdersDrawerProps {
  agentId: string;
  onClose: () => void;
}

export function DeliveryBoyOrdersDrawer({ agentId, onClose }: DeliveryBoyOrdersDrawerProps) {
  const { orders } = useOrderStore();
  const { agents } = useDeliveryBoyStore();
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);

  const agent = agents.find((a) => a.id === agentId);
  const agentOrders = orders
    .filter((o) => o.assignedAgentId === agentId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const { filter, setFilter, filtered, lifetimeStats, periodStats } = useDriverOrderFilter(agentOrders);

  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col h-full overflow-hidden">
        <OrdersDrawerHeader name={agent.name} onClose={onClose} />

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <DriverLifetimeStats stats={lifetimeStats} />

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Filter by Period</p>
            <DriverOrderDateFilter activeFilter={filter} onFilterChange={setFilter} />
          </div>

          <DriverPeriodStats stats={periodStats} filter={filter} />

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {filter === "all" ? "All" : "Filtered"} Orders ({filtered.length})
            </p>
            <DeliveryBoyOrdersTable orders={filtered} onOrderClick={setViewingOrderId} />
          </div>
        </div>
      </div>

      {viewingOrderId && (
        <OrderDetailDrawer
          orderId={viewingOrderId}
          onClose={() => setViewingOrderId(null)}
          onAssign={() => {}}
        />
      )}
    </div>
  );
}
