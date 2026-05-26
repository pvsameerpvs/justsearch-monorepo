import { ChevronRight } from "lucide-react";
import { OrderCardFooter } from "./order-card-footer";
import { OrderCardHeader } from "./order-card-header";
import { OrderCardMeta } from "./order-card-meta";
import type { DashboardOrder } from "@/lib/stores/order-store";

const NEXT_STATUS_LABEL: Record<string, string> = {
  pending: "Accept",
  confirmed: "Start Preparing",
  preparing: "Mark Ready",
  ready: "Send for Delivery",
  out_for_delivery: "Complete",
};

export function OrderCard({ order, onAccept, onReject, onAdvance, onAssign, onView }: {
  order: DashboardOrder;
  onAccept: () => void;
  onReject: () => void;
  onAdvance: () => void;
  onAssign: () => void;
  onView: () => void;
}) {
  const nextLabel = NEXT_STATUS_LABEL[order.status];

  return (
    <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:border-slate-200/80">
      <button onClick={onView} className="w-full text-left p-4">
        <OrderCardHeader order={order} />
        <OrderCardMeta order={order} />

        {nextLabel && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-600">
            <ChevronRight className="h-3 w-3" /> Next: {nextLabel}
          </div>
        )}
      </button>

      <OrderCardFooter
        status={order.status}
        type={order.type}
        hasAgent={!!order.assignedAgentId}
        onAccept={onAccept}
        onReject={onReject}
        onAdvance={onAdvance}
        onAssign={onAssign}
      />
    </div>
  );
}
