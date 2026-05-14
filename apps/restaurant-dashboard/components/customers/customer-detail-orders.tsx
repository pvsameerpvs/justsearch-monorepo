import { ShoppingBag, Package, MapPin, Clock, CheckCircle2, XCircle } from "lucide-react";
import type { DashboardOrder } from "@/lib/stores/order-store";

interface CustomerDetailOrdersProps {
  orders: DashboardOrder[];
  onOrderClick: (orderId: string) => void;
}

export function CustomerDetailOrders({ orders, onOrderClick }: CustomerDetailOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingBag className="h-8 w-8 text-slate-300 mb-3" />
        <p className="text-sm font-bold text-slate-900">No orders yet</p>
        <p className="text-xs text-slate-400 mt-1">This customer hasn't placed any orders</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <button
          key={order.id}
          onClick={() => onOrderClick(order.id)}
          className="w-full text-left elegant-card p-3 hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-900">{order.code}</span>
              <StatusBadge status={order.status} />
            </div>
            <span className="text-sm font-bold text-slate-900">AED {order.total}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
            <MapPin className="h-3 w-3" />
            {order.address}
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span>{order.orderItems.length} items</span>
            <span>{order.paymentMethod}</span>
            <span>{order.createdAt.slice(0, 10)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const meta: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; label: string }> = {
    pending: { icon: Clock, color: "text-amber-700", bg: "bg-amber-50", label: "Pending" },
    confirmed: { icon: CheckCircle2, color: "text-blue-700", bg: "bg-blue-50", label: "Confirmed" },
    preparing: { icon: Clock, color: "text-orange-700", bg: "bg-orange-50", label: "Preparing" },
    ready: { icon: CheckCircle2, color: "text-violet-700", bg: "bg-violet-50", label: "Ready" },
    out_for_delivery: { icon: Clock, color: "text-indigo-700", bg: "bg-indigo-50", label: "Out for Delivery" },
    completed: { icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50", label: "Completed" },
    cancelled: { icon: XCircle, color: "text-red-700", bg: "bg-red-50", label: "Cancelled" },
  };
  const m = meta[status] ?? meta.pending;
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${m.bg} ${m.color}`}>
      <Icon className="h-3 w-3" />
      {m.label}
    </span>
  );
}
