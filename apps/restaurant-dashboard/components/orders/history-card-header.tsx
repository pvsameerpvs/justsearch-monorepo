import { CheckCircle, XCircle } from "lucide-react";
import { OrderStatusBadge } from "./order-status-config";
import type { DashboardOrder } from "@/lib/stores/order-store";

export function HistoryCardHeader({ order, isCompleted }: {
  order: DashboardOrder;
  isCompleted: boolean;
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
