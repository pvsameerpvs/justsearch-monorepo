const STATUS_META: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  active: { label: "Active", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  inactive: { label: "Paused", bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" },
  expired: { label: "Expired", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  scheduled: { label: "Scheduled", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  depleted: { label: "Depleted", bg: "bg-slate-50", text: "text-slate-500", dot: "bg-slate-400" },
};

interface VoucherStatusBadgeProps {
  status: string;
}

export function VoucherStatusBadge({ status }: VoucherStatusBadgeProps) {
  const meta = STATUS_META[status] ?? STATUS_META.inactive;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${meta.bg} ${meta.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
