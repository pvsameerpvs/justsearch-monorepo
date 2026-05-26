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
    <button onClick={onView} className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 text-left w-full p-0 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.1)] hover:border-slate-200/80">
      <div className="p-5">
        <HistoryCardHeader order={order} isCompleted={isCompleted} />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <MetaPill icon={<Phone className="h-3 w-3" />} text={order.customerPhone} />
          <MetaPill icon={<MapPin className="h-3 w-3" />} text={order.address} truncate />
          <MetaPill icon={<Package className="h-3 w-3" />} text={order.type.replace("_", " ")} />
          <MetaPill icon={<Calendar className="h-3 w-3" />} text={formatDateTime(order.createdAt)} />
          <MetaPill icon={<CreditCard className="h-3 w-3" />} text={order.paymentMethod} />
        </div>

        {isCancelled && order.cancelReason && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200/60 bg-red-50/80 p-3">
            <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">Cancellation Reason</p>
              <p className="text-xs font-semibold text-red-700 mt-0.5">{order.cancelReason}</p>
            </div>
          </div>
        )}

        <div className="my-3 border-t border-slate-100/80" />
        <HistoryCardAgent order={order} isCompleted={isCompleted} isCancelled={isCancelled} />
      </div>

      <HistoryCardFooter order={order} isCompleted={isCompleted} />
    </button>
  );
}

function MetaPill({ icon, text, truncate }: { icon: React.ReactNode; text: string; truncate?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500 ${truncate ? "max-w-[160px] truncate" : ""}`}>
      {icon}
      <span className={truncate ? "truncate" : ""}>{text}</span>
    </span>
  );
}
