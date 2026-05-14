import { Clock, CheckCircle2, XCircle } from "lucide-react";

interface OrderStatusBadgeProps {
  status: string;
}

const STATUS_META: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; label: string }> = {
  pending: { icon: Clock, color: "text-amber-700", bg: "bg-amber-50", label: "Pending" },
  confirmed: { icon: CheckCircle2, color: "text-blue-700", bg: "bg-blue-50", label: "Confirmed" },
  preparing: { icon: Clock, color: "text-orange-700", bg: "bg-orange-50", label: "Preparing" },
  ready: { icon: CheckCircle2, color: "text-violet-700", bg: "bg-violet-50", label: "Ready" },
  out_for_delivery: { icon: Clock, color: "text-indigo-700", bg: "bg-indigo-50", label: "Out for Delivery" },
  completed: { icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50", label: "Completed" },
  cancelled: { icon: XCircle, color: "text-red-700", bg: "bg-red-50", label: "Cancelled" },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const m = STATUS_META[status] ?? STATUS_META.pending;
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${m.bg} ${m.color}`}>
      {m.label}
    </span>
  );
}
