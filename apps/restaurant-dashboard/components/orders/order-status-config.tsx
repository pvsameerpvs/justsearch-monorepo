import { Clock, Check, ChefHat, Package, Truck, CheckCircle, AlertCircle, Ban } from 'lucide-react';

export const ORDER_FLOW = [
  { value: "pending", label: "Pending", icon: AlertCircle, class: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "confirmed", label: "Confirmed", icon: Check, class: "bg-sky-50 text-sky-700 border-sky-200" },
  { value: "preparing", label: "Preparing", icon: ChefHat, class: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "ready", label: "Ready", icon: Package, class: "bg-violet-50 text-violet-700 border-violet-200" },
  { value: "out_for_delivery", label: "Out for Delivery", icon: Truck, class: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { value: "completed", label: "Completed", icon: CheckCircle, class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "cancelled", label: "Cancelled", icon: Ban, class: "bg-red-50 text-red-700 border-red-200" },
] as const;

export type OrderStatusValue = (typeof ORDER_FLOW)[number]["value"];

export function OrderStatusBadge({ status }: { status: string }) {
  const config = ORDER_FLOW.find((x) => x.value === status);
  const Icon = config?.icon ?? Clock;
  return (
    <span className={`status-chip border ${config?.class}`}>
      <Icon className="h-3 w-3" /> {config?.label}
    </span>
  );
}
