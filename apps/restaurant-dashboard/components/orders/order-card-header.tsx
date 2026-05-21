import { OrderStatusBadge } from "./order-status-config";
import { Zap } from "lucide-react";
import type { DashboardOrder } from "@/lib/stores/order-store";
import { OrderTypeBadge } from "./order-type-badge";

interface OrderCardHeaderProps {
  order: DashboardOrder;
}

export function OrderCardHeader({ order }: OrderCardHeaderProps) {
  const isPending = order.status === "pending";
  const initials = order.customerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${isPending ? "bg-orange-100 text-orange-700 ring-2 ring-orange-200" : "bg-slate-100 text-slate-600"}`}>
          {isPending ? <Zap className="h-4 w-4" /> : initials}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-slate-900">{order.code}</span>
            <OrderStatusBadge status={order.status} />
            <OrderTypeBadge type={order.type} />
          </div>
          <p className="text-sm font-semibold text-slate-700 mt-0.5">{order.customerName}</p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-lg font-bold text-slate-900">AED {order.total}</p>
        <p className="text-xs text-slate-500">{order.items} items</p>
      </div>
    </div>
  );
}
