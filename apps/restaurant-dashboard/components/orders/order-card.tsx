import { Phone, MapPin, Clock, Package, ChevronRight } from "lucide-react";
import { OrderStatusBadge } from "./order-status-config";
import { OrderCardFooter } from "./order-card-footer";
import { formatTime } from "./time-utils";
import type { DashboardOrder } from "@/lib/stores/order-store";

const NEXT_STATUS_LABEL: Record<string, string> = {
  pending: "Accept",
  confirmed: "Start Preparing",
  preparing: "Mark Ready",
  ready: "Send for Delivery",
  out_for_delivery: "Complete",
};

export function OrderCard({ order, onAccept, onAssign, onView }: {
  order: DashboardOrder;
  onAccept: () => void;
  onAssign: () => void;
  onView: () => void;
}) {
  const isPending = order.status === "pending";
  const isDelivery = order.type === "delivery";
  const initials = order.customerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const nextLabel = NEXT_STATUS_LABEL[order.status];

  return (
    <div className="elegant-card p-0 overflow-hidden">
      <button onClick={onView} className="w-full text-left p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${isPending ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600"}`}>
              {initials}
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

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {order.customerPhone}</span>
          {isDelivery && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {order.address}</span>}
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatTime(order.createdAt)}</span>
          <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {order.type.replace("_", " ")}</span>
        </div>

        {nextLabel && (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-600">
            <ChevronRight className="h-3 w-3" /> Next: {nextLabel}
          </div>
        )}
      </button>

      <OrderCardFooter isPending={isPending} hasAgent={!!order.assignedAgentId} onAccept={onAccept} onAssign={onAssign} />
    </div>
  );
}
