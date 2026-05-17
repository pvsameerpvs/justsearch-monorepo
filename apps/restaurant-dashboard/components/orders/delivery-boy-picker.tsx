"use client";

import { X, Users, AlertCircle } from "lucide-react";
import { useDeliveryBoyStore } from "@/lib/stores/delivery-boy-store";
import { useDeliveryAgentsQuery } from "@/lib/hooks/use-delivery-agents-query";
import { useOrderStore } from "@/lib/stores/order-store";
import { useAssignDriver } from "@/lib/hooks/use-assign-driver";
import { useEffect } from "react";
import { DeliveryBoyRow } from "./delivery-boy-row";

interface DeliveryBoyPickerProps {
  orderId: string;
  onClose: () => void;
}

export function DeliveryBoyPicker({ orderId, onClose }: DeliveryBoyPickerProps) {
  const { agents, setAgents } = useDeliveryBoyStore();
  const { data: apiData } = useDeliveryAgentsQuery();
  const { orders, assignAgent } = useOrderStore();
  const { mutate: assignDriver } = useAssignDriver();

  useEffect(() => {
    if (apiData?.agents) {
      setAgents(apiData.agents);
    }
  }, [apiData, setAgents]);

  const order = orders.find((o) => o.id === orderId);
  const availableCount = agents.filter((a) => a.status === "online").length;

  const getAssignedOrderCode = (agentId: string) => {
    const assignedOrder = orders.find((o) => o.assignedAgentId === agentId && o.id !== orderId);
    return assignedOrder?.code ?? null;
  };

  const handleAssign = (agentId: string) => {
    assignAgent(orderId, agentId);
    assignDriver({ orderId, driverId: agentId });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Assign Delivery Boy</h3>
              <p className="text-xs text-slate-500">Order {order?.code} — AED {order?.total}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3">
          {availableCount === 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>All delivery boys are busy or offline. You can still manually assign anyone below.</span>
            </div>
          )}

          {agents.map((agent) => (
            <DeliveryBoyRow
              key={agent.id}
              agent={agent}
              assignedOrderCode={getAssignedOrderCode(agent.id)}
              onAssign={() => handleAssign(agent.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
