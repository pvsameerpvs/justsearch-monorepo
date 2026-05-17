import { CheckCircle2, Sparkles } from "lucide-react";
import type { DeliveryOrder } from "@/lib/delivery-types";

type DriverCompletedSectionProps = {
  orders: DeliveryOrder[];
};

export function DriverCompletedSection({ orders }: DriverCompletedSectionProps) {
  const completed = orders.filter((o) => o.status === 'delivered');

  if (completed.length === 0) return null;

  return (
    <div className="rounded-[18px] border border-emerald-100 bg-emerald-50/60 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-emerald-600" />
        <h3 className="text-sm font-bold text-emerald-900">Completed today</h3>
      </div>
      <div className="space-y-2">
        {completed.slice(0, 3).map((order) => (
          <div key={order.assignmentId} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-medium text-slate-700">{order.code}</span>
              <span className="text-slate-500">{order.customerName}</span>
            </div>
            <span className="font-semibold text-slate-900">{order.orderValue}</span>
          </div>
        ))}
        {completed.length > 3 && (
          <p className="text-[11px] text-emerald-700 font-medium">+ {completed.length - 3} more</p>
        )}
      </div>
    </div>
  );
}
