"use client";

import { useState } from "react";
import { useOrderStore } from "@/lib/stores/order-store";
import { useDeliveryBoyStore } from "@/lib/stores/delivery-boy-store";
import { OrderStatusBadge } from "./order-status-config";
import { MapPin, UserCheck, X } from "lucide-react";

export function OrderAssignment() {
  const { orders, assignAgent } = useOrderStore();
  const { agents } = useDeliveryBoyStore();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const unassigned = orders.filter((o) => o.type === "delivery" && !o.assignedAgentId && !["completed", "cancelled"].includes(o.status));
  const activeAgents = agents.filter((a) => a.isActive);

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Delivery Assignment</h3>
          <p className="text-sm text-slate-500">Assign delivery agents to orders</p>
        </div>
        {unassigned.length > 0 && <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">{unassigned.length} pending</span>}
      </div>

      {unassigned.length === 0 ? (
        <div className="text-center py-8 text-slate-400"><p className="text-sm">All delivery orders assigned</p></div>
      ) : (
        <div className="space-y-2">
          {unassigned.map((order) => (
            <div key={order.id} className="rounded-xl border border-slate-100 bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{order.code}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{order.customerName}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5"><MapPin className="h-3 w-3" /> {order.address}</div>
                  <p className="text-xs text-slate-400">{order.items} items · AED {order.total}</p>
                </div>
                <div className="shrink-0">
                  {selectedOrderId === order.id ? (
                    <div className="space-y-1.5">
                      {activeAgents.map((agent) => (
                        <button key={agent.id} onClick={() => { assignAgent(order.id, agent.uniqueId); setSelectedOrderId(null); }} className="flex w-full items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold">{agent.name.split(" ").map((n) => n[0]).join("")}</span>
                          {agent.name}
                        </button>
                      ))}
                      <button onClick={() => setSelectedOrderId(null)} className="block w-full text-center text-xs text-slate-400 hover:text-slate-600"><X className="inline h-3 w-3 mr-1" /> Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setSelectedOrderId(order.id)} className="elegant-btn-secondary text-xs flex items-center gap-1"><UserCheck className="h-3.5 w-3.5" /> Assign</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
