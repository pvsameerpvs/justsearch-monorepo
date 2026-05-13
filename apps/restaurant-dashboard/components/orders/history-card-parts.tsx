import { CheckCircle, XCircle, User } from "lucide-react";
import type { DashboardOrder } from "@/lib/stores/order-store";
import type { DeliveryBoy } from "@/lib/stores/delivery-boy-store";
import { useDeliveryBoyStore } from "@/lib/stores/delivery-boy-store";
import { OrderStatusBadge } from "./order-status-config";

export function HistoryCardHeader({ order, isCompleted, isCancelled }: {
  order: DashboardOrder;
  isCompleted: boolean;
  isCancelled: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
          isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
        }`}>
          {isCompleted ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">{order.code}</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm font-semibold text-slate-700">{order.customerName}</p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-lg font-bold text-slate-900">AED {order.total}</p>
        <p className="text-xs text-slate-500">{order.items} items</p>
      </div>
    </div>
  );
}

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

export function HistoryCardFooter({ order, isCompleted }: {
  order: DashboardOrder;
  isCompleted: boolean;
}) {
  return (
    <div className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-between">
      <span className="text-xs font-semibold text-slate-500">{order.paymentMethod}</span>
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        {isCompleted ? "Completed" : "Cancelled"}
      </span>
    </div>
  );
}
