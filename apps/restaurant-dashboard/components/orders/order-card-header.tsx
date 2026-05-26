import { Zap } from "lucide-react";
import { OrderStatusBadge } from "./order-status-config";
import { OrderTypeBadge } from "./order-type-badge";
import type { DashboardOrder } from "@/lib/stores/order-store";

interface OrderCardHeaderProps {
  order: DashboardOrder;
}

export function OrderCardHeader({ order }: OrderCardHeaderProps) {
  const isPending = order.status === "pending";
  const initials = order.customerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold overflow-hidden ${
          isPending
            ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg shadow-orange-500/20"
            : "bg-slate-100 text-slate-600 ring-1 ring-slate-200/60"
        }`}>
          {isPending ? (
            <Zap className="h-4 w-4" />
          ) : (
            initials
          )}
          {isPending && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-white animate-pulse" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-black text-slate-900 tracking-tight">{order.code}</span>
            <OrderStatusBadge status={order.status} />
            <OrderTypeBadge type={order.type} />
          </div>
          <p className="text-sm font-semibold text-slate-600 mt-0.5">{order.customerName}</p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xl font-black text-slate-900 tracking-tight">AED {order.total}</p>
        <p className="text-xs text-slate-400 font-medium">{order.items} items</p>
      </div>
    </div>
  );
}
