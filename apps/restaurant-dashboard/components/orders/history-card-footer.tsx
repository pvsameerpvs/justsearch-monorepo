import { Ban, CheckCircle, CreditCard } from "lucide-react";
import type { DashboardOrder } from "@/lib/stores/order-store";

export function HistoryCardFooter({ order, isCompleted }: {
  order: DashboardOrder;
  isCompleted: boolean;
}) {
  return (
    <div className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <CreditCard className="h-3 w-3 text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 capitalize">{order.paymentMethod}</span>
      </div>
      <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${isCompleted ? "text-emerald-500" : "text-red-500"}`}>
        {isCompleted ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
        {isCompleted ? "Completed" : "Cancelled"}
      </span>
    </div>
  );
}
