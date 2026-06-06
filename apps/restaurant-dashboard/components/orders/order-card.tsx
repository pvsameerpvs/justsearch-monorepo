import { OrderCardFooter } from "./order-card-footer";
import { OrderCardHeader } from "./order-card-header";
import { OrderCardMeta } from "./order-card-meta";
import { ORDER_FLOW } from "./order-status-config";
import type { DashboardOrder } from "@/lib/stores/order-store";

interface OrderCardProps {
  order: DashboardOrder;
  isPending: boolean;
  onAccept: () => void;
  onReject: () => void;
  onAdvance: () => void;
  onAssign: () => void;
  onView: () => void;
}

export function OrderCard({ order, isPending, onAccept, onReject, onAdvance, onAssign, onView }: OrderCardProps) {
  const statusConfig = ORDER_FLOW.find((x) => x.value === order.status);
  const accentGradient = statusConfig?.gradient ?? "from-slate-400 to-slate-500";

  const isOrderPending = order.status === "pending";

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.1)] hover:border-slate-200/80 ${isOrderPending ? "pending-blink" : ""}`}>
      <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-full bg-gradient-to-b ${accentGradient} ${isOrderPending ? "opacity-100" : "opacity-60"}`} />

      <button onClick={onView} className="w-full text-left px-5 py-4 pl-6">
        <OrderCardHeader order={order} />
        <OrderCardMeta order={order} />
      </button>

      <OrderCardFooter
        status={order.status}
        type={order.type}
        hasAgent={!!order.assignedAgentId}
        isPending={isPending}
        onAccept={onAccept}
        onReject={onReject}
        onAdvance={onAdvance}
        onAssign={onAssign}
      />
    </div>
  );
}
