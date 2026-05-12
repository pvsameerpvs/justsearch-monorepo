import { MapPin, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import type { DeliveryOrder } from "@/lib/delivery-types";

const statusColors: Record<string, string> = {
  assigned: "bg-slate-100 text-slate-700",
  picked_up: "bg-blue-50 text-blue-700",
  on_route: "bg-amber-50 text-amber-700",
  arrived: "bg-violet-50 text-violet-700",
  delivered: "bg-emerald-50 text-emerald-700",
};

type DeliveryOrderListCardProps = {
  order: DeliveryOrder;
  isSelected: boolean;
  onSelect: () => void;
  onNext: () => void;
};

export function DeliveryOrderListCard({ order, isSelected, onSelect, onNext }: DeliveryOrderListCardProps) {
  const isDone = order.status === "delivered";

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        isSelected ? "border-amber-300 bg-amber-50/30 ring-1 ring-amber-300" : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">{order.code}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[order.status]}`}>
              {order.status.replace("_", " ")}
            </span>
            {order.priority === "rush" && (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">RUSH</span>
            )}
          </div>
          <p className="mt-1 text-sm font-medium text-slate-700">{order.customerName}</p>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
            <MapPin className="h-3 w-3" /> {order.neighborhood}
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {order.orderedAtLabel}</span>
            <span>{order.itemCount} items</span>
            <span className="font-bold">{order.orderValue}</span>
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${order.paymentMode === "cash_on_delivery" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
              {order.paymentMode === "cash_on_delivery" ? "COD" : "Prepaid"}
            </span>
          </div>
        </div>
        {!isDone && isSelected && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="flex h-8 items-center gap-1 rounded-lg bg-emerald-500 px-3 text-xs font-bold text-white hover:bg-emerald-600"
          >
            Next <ChevronRight className="h-3 w-3" />
          </button>
        )}
        {isDone && (
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
        )}
      </div>
    </button>
  );
}
