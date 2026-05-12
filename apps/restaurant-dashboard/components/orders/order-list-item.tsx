"use client";

import { useOrderStore, type DashboardOrder } from "@/lib/stores/order-store";
import { OrderStatusBadge } from "./order-status-config";
import { Check, X, ChevronRight } from "lucide-react";

export function OrderListItem({ order }: { order: DashboardOrder }) {
  const { updateStatus } = useOrderStore();

  const nextStatusMap: Record<string, string> = {
    confirmed: 'preparing',
    preparing: 'ready',
    ready: 'out_for_delivery',
    out_for_delivery: 'completed',
  };

  const handleNext = () => {
    const next = nextStatusMap[order.status];
    if (next) updateStatus(order.id, next as never);
  };

  return (
    <div className="elegant-card p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">{order.code}</span>
            <OrderStatusBadge status={order.status} />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{order.type.replace('_', ' ')}</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{order.customerName}</p>
          <p className="text-xs text-slate-400">{order.items} items · AED {order.total}</p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          {order.status === 'pending' && (
            <>
              <button onClick={() => updateStatus(order.id, 'cancelled')} className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100">
                <X className="h-4 w-4" />
              </button>
              <button onClick={() => updateStatus(order.id, 'confirmed')} className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
                <Check className="h-4 w-4" />
              </button>
            </>
          )}
          {['confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(order.status) && (
            <button onClick={handleNext} className="elegant-btn-primary text-xs flex items-center gap-1">
              Next <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
