import type { DashboardOrder } from "@/lib/stores/order-store";

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
