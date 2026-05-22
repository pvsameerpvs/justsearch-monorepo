"use client";

import { useEffect } from "react";
import { useDeliveryBoyStore } from "@/lib/stores/delivery-boy-store";
import { useOrderStore } from "@/lib/stores/order-store";
import { useDeliveryAgentsQuery } from "@/lib/hooks/use-delivery-agents-query";
import { useAssignDriver } from "@/lib/hooks/use-assign-driver";
import type { DeliveryBoy } from "@/lib/stores/delivery-boy-store";

interface RowData {
  agent: DeliveryBoy;
  assignedOrderCode: string | null;
  isRecommended: boolean;
  isCurrentlyAssigned: boolean;
  onAssign: () => void;
}

export function useDeliveryBoyPicker(orderId: string, onClose: () => void) {
  const { agents, setAgents } = useDeliveryBoyStore();
  const { data: apiData } = useDeliveryAgentsQuery();
  const { orders, assignAgent } = useOrderStore();
  const { mutate: assignDriver } = useAssignDriver();

  useEffect(() => { if (apiData?.agents) setAgents(apiData.agents); }, [apiData, setAgents]);

  const order = orders.find((o) => o.id === orderId);
  const currentlyAssigned = order?.assignedAgentId ?? null;

  const sorted = [...agents].sort((a, b) => {
    const ao = a.status === "offline" ? 1 : 0, bo = b.status === "offline" ? 1 : 0;
    if (ao !== bo) return bo - ao;
    return (a.activeOrderCount ?? 0) - (b.activeOrderCount ?? 0);
  });

  const freeCount = agents.filter((a) => a.status !== "offline" && (a.activeOrderCount ?? 0) === 0).length;
  const busyCount = agents.filter((a) => a.status !== "offline" && (a.activeOrderCount ?? 0) > 0).length;
  const recommendedId = sorted.find((a) => a.status !== "offline" && a.id !== currentlyAssigned)?.id ?? null;

  const rows: RowData[] = sorted.map((agent) => {
    const assignedOrderCode = orders.find((o) => o.assignedAgentId === agent.id && o.id !== orderId)?.code ?? null;
    return {
      agent,
      assignedOrderCode,
      isRecommended: agent.id === recommendedId,
      isCurrentlyAssigned: agent.id === currentlyAssigned,
      onAssign: () => {
        if (agent.id === currentlyAssigned) { onClose(); return; }
        assignAgent(orderId, agent.id);
        assignDriver({ orderId, driverId: agent.id });
        onClose();
      },
    };
  });

  return { order, rows, freeCount, busyCount };
}
