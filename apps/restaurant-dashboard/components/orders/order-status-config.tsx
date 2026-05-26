import { Clock, Check, ChefHat, Package, Truck, CheckCircle, AlertCircle, Ban } from 'lucide-react';

export const ORDER_FLOW = [
  { value: "pending", label: "Pending", icon: AlertCircle, gradient: "from-orange-400 to-amber-500", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  { value: "confirmed", label: "Confirmed", icon: Check, gradient: "from-sky-400 to-blue-500", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  { value: "preparing", label: "Preparing", icon: ChefHat, gradient: "from-amber-400 to-orange-500", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  { value: "ready", label: "Ready", icon: Package, gradient: "from-violet-400 to-purple-500", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  { value: "out_for_delivery", label: "Out for Delivery", icon: Truck, gradient: "from-indigo-400 to-blue-500", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  { value: "completed", label: "Completed", icon: CheckCircle, gradient: "from-emerald-400 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  { value: "cancelled", label: "Cancelled", icon: Ban, gradient: "from-red-400 to-rose-500", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
] as const;

export type OrderStatusValue = (typeof ORDER_FLOW)[number]["value"];

export function OrderStatusBadge({ status }: { status: string }) {
  const config = ORDER_FLOW.find((x) => x.value === status);
  const Icon = config?.icon ?? Clock;
  if (!config) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold shadow-sm ${config.bg} ${config.text} ${config.border}`}>
      <div className={`flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br ${config.gradient} text-white`}>
        <Icon className="h-2.5 w-2.5" />
      </div>
      {config.label}
    </span>
  );
}
