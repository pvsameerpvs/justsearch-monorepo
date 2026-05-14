import { AlertCircle } from "lucide-react";
import { ORDER_FLOW } from "./order-status-config";
import { StepperStep } from "./stepper-step";
import type { OrderStatus } from "@/lib/stores/order-store";

interface OrderStatusStepperProps {
  currentStatus: string;
  timeline: { status: OrderStatus; time: string }[];
  cancelled?: boolean;
}

export function OrderStatusStepper({ currentStatus, timeline, cancelled }: OrderStatusStepperProps) {
  if (cancelled) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <span className="text-sm font-bold text-red-700">Order Cancelled</span>
      </div>
    );
  }

  const currentIndex = ORDER_FLOW.findIndex((s) => s.value === currentStatus);
  if (currentIndex === -1) return null;

  const isCompleted = currentStatus === "completed";
  const timeMap = new Map(timeline.map((t) => [t.status, t.time]));

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Progress</p>
      <div className="relative pl-1">
        {ORDER_FLOW.map((step, idx) => (
          <StepperStep
            key={step.value}
            step={step}
            idx={idx}
            currentIndex={currentIndex}
            isCompleted={isCompleted}
            timeMap={timeMap}
          />
        ))}
      </div>
    </div>
  );
}
