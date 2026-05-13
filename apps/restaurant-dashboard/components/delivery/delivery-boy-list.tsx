import type { DeliveryBoy } from "@/lib/stores/delivery-boy-store";
import { DeliveryBoyCard } from "./delivery-boy-card";

interface DeliveryBoyListProps {
  agents: DeliveryBoy[];
  onToggleActive: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
  onViewOrders: (id: string) => void;
}

export function DeliveryBoyList({ agents, onToggleActive, onRemove, onEdit, onViewOrders }: DeliveryBoyListProps) {
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
        />
      ))}
    </div>
  );
}
