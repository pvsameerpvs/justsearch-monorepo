import type { DashboardOrder } from "@/lib/stores/order-store";

export function OrderTotals({ order }: { order: DashboardOrder }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Subtotal ({order.items} items)</span>
        <span>AED {order.subtotal}</span>
      </div>
      {order.deliveryFee > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Delivery Fee</span>
          <span>AED {order.deliveryFee}</span>
        </div>
      )}
      {order.tax > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Tax</span>
          <span>AED {order.tax}</span>
        </div>
      )}
      <div className="h-px bg-slate-200 my-1" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-900">Total</span>
        <span className="text-lg font-bold text-slate-900">AED {order.total}</span>
      </div>
    </div>
  );
}
