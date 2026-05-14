"use client";

import type { DeliveryOrder } from "@/lib/delivery-types";

type DriverSlideCodBadgeProps = {
  order: DeliveryOrder;
};

export function DriverSlideCodBadge({ order }: DriverSlideCodBadgeProps) {
  if (order.paymentMode !== "cash_on_delivery") return null;
  return (
    <div className="mt-2 rounded-[12px] border border-amber-100 bg-amber-50 px-3 py-2 text-center">
      <p className="text-[11px] font-bold text-amber-700">Collect cash: AED {order.total.toFixed(2)}</p>
    </div>
  );
}
