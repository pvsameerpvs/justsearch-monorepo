"use client";

import { useState } from "react";
import { useOrderStore } from "@/lib/stores/order-store";
import { useDeliveryBoyStore } from "@/lib/stores/delivery-boy-store";
import { Package } from "lucide-react";
import { OrderAssignmentCard } from "./order-assignment-card";

export function OrderAssignment() {
  const { orders, assignAgent } = useOrderStore();
  const { agents } = useDeliveryBoyStore();
  const [selected, setSelected] = useState<string | null>(null);

  const unassigned = orders.filter(
    (o) => o.type === "delivery" && !o.assignedAgentId && o.status !== "completed" && o.status !== "cancelled"
  );

  const active = agents.filter((a) => a.isActive);

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Delivery Assignment</h3>
          <p className="text-sm text-slate-500">Assign delivery agents to orders</p>
        </div>
        {unassigned.length > 0 && (
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">
            {unassigned.length} pending
          </span>
        )}
      </div>

      {unassigned.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <Package className="h-6 w-6 text-emerald-500" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-600">All orders assigned</p>
          <p className="text-xs text-slate-400">No pending delivery orders</p>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {unassigned.map((order) => (
            <OrderAssignmentCard
              key={order.id}
              order={order}
              agents={active}
              selected={selected === order.id}
              onSelect={() => setSelected(selected === order.id ? null : order.id)}
              onAssign={(agentId) => {
                assignAgent(order.id, agentId);
                setSelected(null);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
