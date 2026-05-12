import { MapPin, UserCheck } from "lucide-react";
import type { DashboardOrder } from "@/lib/stores/order-store";
import type { DeliveryBoy } from "@/lib/stores/delivery-boy-store";

export function OrderAssignmentCard({
  order,
  agents,
  selected,
  onSelect,
  onAssign,
}: {
  order: DashboardOrder;
  agents: DeliveryBoy[];
  selected: boolean;
  onSelect: () => void;
  onAssign: (agentId: string) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">{order.code}</span>
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-600">
              {order.status}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-700">{order.customerName}</p>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="h-3 w-3" />
            {order.address}
          </div>
          <p className="mt-0.5 text-xs text-slate-400">{order.items} items · AED {order.total}</p>
        </div>

        <div className="shrink-0">
          {selected ? (
            <div className="space-y-1.5">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => onAssign(agent.uniqueId)}
                  className="flex w-full items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold">
                    {agent.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  {agent.name}
                </button>
              ))}
              <button
                type="button"
                onClick={onSelect}
                className="block w-full text-center text-xs text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onSelect}
              className="elegant-btn-secondary text-xs"
            >
              <UserCheck className="mr-1.5 h-3.5 w-3.5" />
              Assign
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
