import { Check } from "lucide-react";
import { ORDER_FLOW } from "./order-status-config";
import { formatTime, getDurationBetween } from "./time-utils";
import type { OrderStatus } from "@/lib/stores/order-store";

const STATUS_META: Record<string, { line: string; dot: string; text: string; iconColor: string }> = {
  pending:          { line: "bg-emerald-400", dot: "bg-emerald-500", text: "text-emerald-700", iconColor: "text-white" },
  confirmed:        { line: "bg-emerald-400", dot: "bg-emerald-500", text: "text-emerald-700", iconColor: "text-white" },
  preparing:        { line: "bg-emerald-400", dot: "bg-emerald-500", text: "text-emerald-700", iconColor: "text-white" },
  ready:            { line: "bg-emerald-400", dot: "bg-emerald-500", text: "text-emerald-700", iconColor: "text-white" },
  out_for_delivery: { line: "bg-emerald-400", dot: "bg-emerald-500", text: "text-emerald-700", iconColor: "text-white" },
  completed:        { line: "bg-emerald-400", dot: "bg-emerald-500", text: "text-emerald-700", iconColor: "text-white" },
};

const CURRENT_META = { line: "bg-slate-200", dot: "bg-amber-500 ring-4 ring-amber-100", text: "text-amber-700", iconColor: "text-white" };
const PENDING_META = { line: "bg-slate-200", dot: "border-2 border-slate-300 bg-white", text: "text-slate-400", iconColor: "text-slate-400" };

interface StepperStepProps {
  step: (typeof ORDER_FLOW)[number];
  idx: number;
  currentIndex: number;
  isCompleted: boolean;
  timeMap: Map<OrderStatus, string>;
}

export function StepperStep({ step, idx, currentIndex, isCompleted, timeMap }: StepperStepProps) {
  const Icon = step.icon;
  const isDone = idx < currentIndex || isCompleted;
  const isCurrent = idx === currentIndex && !isCompleted;
  const isLast = idx === ORDER_FLOW.length - 1;

  const meta = isDone ? STATUS_META[step.value] : isCurrent ? CURRENT_META : PENDING_META;
  const time = timeMap.get(step.value as OrderStatus);
  const prevTime = idx > 0 ? timeMap.get(ORDER_FLOW[idx - 1].value as OrderStatus) : null;
  const duration = prevTime && time ? getDurationBetween(prevTime, time) : null;

  return (
    <div className="flex items-start">
      <div className="flex flex-col items-center mr-3 shrink-0">
        <div className={`flex h-6 w-6 items-center justify-center rounded-full shrink-0 ${meta.dot}`}>
          {isDone ? (
            <Check className={`h-3.5 w-3.5 ${meta.iconColor}`} />
          ) : (
            <Icon className={`h-3.5 w-3.5 ${meta.iconColor}`} />
          )}
        </div>
        {!isLast && <div className={`w-0.5 flex-1 min-h-[20px] ${isDone ? "bg-emerald-400" : "bg-slate-200"}`} />}
      </div>

      <div className="flex-1 min-w-0 pb-3">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${meta.text}`}>{step.label}</span>
          {isCurrent && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-700">Current</span>
          )}
        </div>
        {time && (
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            {duration ? `+ ${duration} · ` : ""}
            {formatTime(time)}
          </p>
        )}
      </div>
    </div>
  );
}
