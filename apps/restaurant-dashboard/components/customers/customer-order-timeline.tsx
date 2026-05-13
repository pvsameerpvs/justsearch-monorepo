import { Clock, CheckCircle2 } from "lucide-react";
import type { TimelineEvent } from "@/lib/stores/order-store";

interface OrderTimelineProps {
  timeline: TimelineEvent[];
}

export function OrderTimeline({ timeline }: OrderTimelineProps) {
  if (timeline.length === 0) return null;
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Timeline</p>
      <div className="space-y-2">
        {timeline.map((event, index) => (
          <TimelineRow key={index} event={event} isLast={index === timeline.length - 1} />
        ))}
      </div>
    </div>
  );
}

function TimelineRow({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${isLast ? "bg-emerald-100" : "bg-slate-100"}`}>
        {isLast ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <Clock className="h-3.5 w-3.5 text-slate-400" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-slate-900">{event.label}</p>
        <p className="text-[10px] text-slate-500">{event.time.slice(0, 16).replace("T", " ")}</p>
      </div>
    </div>
  );
}
