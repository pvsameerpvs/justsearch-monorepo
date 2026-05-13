import { Check, X, AlertCircle } from "lucide-react";
import type { TimelineEvent, OrderStatus } from "@/lib/stores/order-store";
import { ORDER_FLOW } from "./order-status-config";
import { formatDateTime, getDurationBetween } from "./time-utils";

const STATUS_META: Record<OrderStatus, { bg: string; border: string; iconColor: string }> = {
  pending:          { bg: "bg-orange-50",  border: "border-orange-200",  iconColor: "text-orange-600" },
  confirmed:        { bg: "bg-sky-50",     border: "border-sky-200",     iconColor: "text-sky-600" },
  preparing:        { bg: "bg-amber-50",   border: "border-amber-200",   iconColor: "text-amber-600" },
  ready:            { bg: "bg-violet-50",  border: "border-violet-200",  iconColor: "text-violet-600" },
  out_for_delivery: { bg: "bg-indigo-50",  border: "border-indigo-200",  iconColor: "text-indigo-600" },
  completed:        { bg: "bg-emerald-50", border: "border-emerald-200", iconColor: "text-emerald-600" },
  cancelled:        { bg: "bg-red-50",     border: "border-red-200",     iconColor: "text-red-600" },
};

export function OrderTimeline({ timeline }: { timeline: TimelineEvent[] }) {
  const sorted = [...timeline].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Timeline</p>
      <div className="relative pl-2">
        {/* Vertical connecting line */}
        <div className="absolute left-[21px] top-3 bottom-3 w-px bg-slate-200" />

        <div className="space-y-0">
          {sorted.map((event, idx) => {
            const isLast = idx === sorted.length - 1;
            const prev = idx > 0 ? sorted[idx - 1] : null;
            const duration = prev ? getDurationBetween(prev.time, event.time) : null;
            const meta = STATUS_META[event.status];
            const flowConfig = ORDER_FLOW.find((f) => f.value === event.status);
            const Icon = flowConfig?.icon ?? (event.status === "cancelled" ? X : AlertCircle);

            return (
              <div key={`${event.status}-${event.time}`}>
                {duration && (
                  <div className="flex items-center gap-2 py-1 pl-[29px]">
                    <div className="h-px w-6 bg-slate-200" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      + {duration}
                    </span>
                  </div>
                )}
                <div className="relative flex items-start gap-3 py-2">
                  {/* Dot */}
                  <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${meta.bg} ${meta.border} mt-0.5`}>
                    {event.status === "completed" ? (
                      <Check className={`h-3.5 w-3.5 ${meta.iconColor}`} />
                    ) : (
                      <Icon className={`h-3.5 w-3.5 ${meta.iconColor}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">{event.label}</p>
                      {isLast && event.status !== "cancelled" && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                          Latest
                        </span>
                      )}
                      {event.status === "cancelled" && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-700">
                          Cancelled
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-400">{formatDateTime(event.time)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
