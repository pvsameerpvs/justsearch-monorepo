import { formatDateTime } from "@/components/orders/time-utils";
import { OrderStatusBadge } from "@/components/orders/order-status-config";
import type { DashboardOrder } from "@/lib/stores/order-store";

interface DeliveryBoyOrdersTableProps {
  orders: DashboardOrder[];
  onOrderClick: (orderId: string) => void;
}

export function DeliveryBoyOrdersTable({ orders, onOrderClick }: DeliveryBoyOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-10">
        <p className="text-sm font-medium text-slate-500">No orders assigned yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <span>Order</span>
        <span className="text-center">Status</span>
        <span className="text-right">Total</span>
        <span className="text-right">Date</span>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-slate-100">
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => onOrderClick(order.id)}
            className="w-full grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-3 items-center text-left hover:bg-slate-50 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{order.code}</span>
              </div>
              <p className="text-xs text-slate-500 truncate">{order.customerName}</p>
              <p className="text-[10px] text-slate-400 truncate">{order.address.slice(0, 40)}</p>
            </div>

            <div className="text-center">
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">AED {order.total}</p>
              <p className="text-[10px] text-slate-500">{order.items} items</p>
            </div>

            <div className="text-right">
              <p className="text-xs font-medium text-slate-500">{formatDateTime(order.createdAt)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
