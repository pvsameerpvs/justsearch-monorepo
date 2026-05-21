import { DeliveryBoyCard } from "./delivery-boy-card";
import type { DeliveryAgent } from "@/lib/hooks/use-delivery-agents-query";

interface DeliveryBoyListProps {
  agents: DeliveryAgent[];
  onToggleActive: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
  onViewOrders: (id: string) => void;
  canManage?: boolean;
}

export function DeliveryBoyList({ agents, onToggleActive, onRemove, onEdit, onViewOrders, canManage }: DeliveryBoyListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {agents.map((agent) => (
        <DeliveryBoyCard
          key={agent.id}
          agent={agent}
          onToggleActive={() => onToggleActive(agent.id)}
          onRemove={() => onRemove(agent.id)}
          onEdit={() => onEdit(agent.id)}
          onViewOrders={() => onViewOrders(agent.id)}
          canManage={canManage}
        />
      ))}
    </div>
  );
}
