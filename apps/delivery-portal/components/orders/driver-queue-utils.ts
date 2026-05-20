import type { DeliveryOrder } from "@/lib/delivery-types";

export const statusColors: Record<string, string> = {
  assigned: "bg-slate-100 text-slate-700",
  picked_up: "bg-blue-50 text-blue-700",
  on_route: "bg-amber-50 text-amber-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

const STATUS_PRIORITY: Record<string, number> = {
  on_route: 1,
  picked_up: 2,
  assigned: 3,
};

export function sortOrdersByUrgency(orders: DeliveryOrder[]): DeliveryOrder[] {
  return [...orders].sort((a, b) => {
    const aDone = a.status === 'delivered' || a.status === 'cancelled';
    const bDone = b.status === 'delivered' || b.status === 'cancelled';
    if (aDone && !bDone) return 1;
    if (bDone && !aDone) return -1;
    const pa = STATUS_PRIORITY[a.status] ?? 99;
    const pb = STATUS_PRIORITY[b.status] ?? 99;
    return pa - pb;
  });
}
