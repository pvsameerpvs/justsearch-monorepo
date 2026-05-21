import { Phone, Package, MapPin, Calendar, AlertCircle, CreditCard } from "lucide-react";
import { HistoryCardHeader } from "./history-card-header";
import { HistoryCardAgent } from "./history-card-agent";
import { HistoryCardFooter } from "./history-card-footer";
import { formatDateTime } from "./time-utils";
import type { DashboardOrder } from "@/lib/stores/order-store";

export function OrderHistoryCard({ order, onView }: {
  order: DashboardOrder;
  onView: () => void;
}) {
  const isCompleted = order.status === "completed";
  const isCancelled = order.status === "cancelled";

  return (
    <button onClick={onView} className="elegant-card text-left w-full p-0 overflow-hidden transition-shadow hover:shadow-md">
      <div className="p-4">
        <HistoryCardHeader order={order} isCompleted={isCompleted} />

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {order.customerPhone}</span>
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {order.address}</span>
          <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {order.type.replace("_", " ")}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDateTime(order.createdAt)}</span>
          <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" /> {order.paymentMethod}</span>
        </div>

        {isCancelled && order.cancelReason && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-2.5">
            <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">Cancellation Reason</p>
              <p className="text-xs font-medium text-red-700 mt-0.5">{order.cancelReason}</p>
            </div>
          </div>
        )}

        <div className="my-3 border-t border-slate-100" />
        <HistoryCardAgent order={order} isCompleted={isCompleted} isCancelled={isCancelled} />
      </div>

      <HistoryCardFooter order={order} isCompleted={isCompleted} />
    </button>
  );
}
