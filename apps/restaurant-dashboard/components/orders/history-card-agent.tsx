import { User } from "lucide-react";
import { useDeliveryBoyStore } from "@/lib/stores/delivery-boy-store";
import type { DashboardOrder } from "@/lib/stores/order-store";
import type { DeliveryBoy } from "@/lib/stores/delivery-boy-store";

export function HistoryCardAgent({ order, isCompleted, isCancelled }: {
  order: DashboardOrder;
  isCompleted: boolean;
  isCancelled: boolean;
}) {
  const { agents } = useDeliveryBoyStore();
  const assignedAgent = agents.find((a) => a.id === order.assignedAgentId);

  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
        {isCompleted ? "Delivered By" : isCancelled ? "Was Assigned To" : "Delivery Agent"}
      </p>
      {assignedAgent ? <AgentInfo agent={assignedAgent} /> : <AgentEmpty />}
    </div>
  );
}

function AgentInfo({ agent }: { agent: DeliveryBoy }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <User className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900">{agent.name}</p>
        <p className="text-xs text-slate-500">{agent.phone}</p>
      </div>
      {agent.rating && (
        <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1">
          <span className="text-xs font-bold text-amber-700">★ {agent.rating}</span>
        </div>
      )}
    </div>
  );
}

function AgentEmpty() {
  return (
    <div className="flex items-center gap-2 text-slate-400">
      <User className="h-4 w-4" />
      <span className="text-sm font-medium">No driver assigned</span>
    </div>
  );
}
