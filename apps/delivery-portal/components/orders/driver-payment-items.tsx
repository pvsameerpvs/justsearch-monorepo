"use client";

import { Utensils } from "lucide-react";
import type { DeliveryOrder } from "@/lib/delivery-types";

type DriverPaymentItemsProps = {
  order: DeliveryOrder;
};

export function DriverPaymentItems({ order }: DriverPaymentItemsProps) {
  const currency = order.orderItems[0]?.currency ?? "AED";

  return (
    <div className="rounded-[18px] border border-slate-100 bg-slate-50 p-4 space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        <Utensils className="h-3.5 w-3.5" />
        Order items ({order.itemCount})
      </div>
      {order.orderItems.map((item, i) => (
        <div key={`${item.name}-${i}`} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-600 border border-slate-200">
              {item.quantity}
            </span>
            <span className="text-sm text-slate-700">{item.name}</span>
          </div>
          <span className="text-sm font-semibold text-slate-900">
            {currency} {item.price * item.quantity}
          </span>
        </div>
      ))}
      <div className="border-t border-slate-200 pt-2 space-y-1">
        <div className="flex justify-between text-xs text-slate-500"><span>Subtotal</span><span>{currency} {order.subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-xs text-slate-500"><span>Delivery fee</span><span>{currency} {order.deliveryFee.toFixed(2)}</span></div>
        <div className="flex justify-between text-xs text-slate-500"><span>Tax</span><span>{currency} {order.tax.toFixed(2)}</span></div>
        <div className="flex justify-between pt-1">
          <span className="text-sm font-bold text-slate-900">Total to collect</span>
          <span className="text-lg font-black text-emerald-700">{currency} {order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
