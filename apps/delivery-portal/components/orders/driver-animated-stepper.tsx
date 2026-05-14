"use client";

import { Zap, AlertTriangle, Clock3 } from "lucide-react";
import { cn } from "@/lib/cn";
import { DriverStatusStepper } from "./driver-status-stepper";
import type { DeliveryOrder } from "@/lib/delivery-types";

const statusColors: Record<string, string> = {
  assigned: "bg-slate-100 text-slate-700 border-slate-200",
  picked_up: "bg-emerald-50 text-emerald-700 border-emerald-200",
  on_route: "bg-emerald-50 text-emerald-700 border-emerald-200",
  arrived: "bg-emerald-50 text-emerald-700 border-emerald-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

type DriverAnimatedStepperProps = {
  order: DeliveryOrder;
};

export function DriverAnimatedStepper({ order }: DriverAnimatedStepperProps) {
  const isDone = order.status === "delivered";

  return (
    <div className="px-4 pt-4 pb-2">
      {/* Order code + badges */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-base font-bold text-slate-900">{order.code}</span>
        <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold border", statusColors[order.status])}>
          {order.status.replace("_", " ")}
        </span>
        {order.priority === "rush" && (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 inline-flex items-center gap-1 border border-red-100">
            <Zap className="h-3 w-3" /> RUSH
          </span>
        )}
        {order.paymentMode === "cash_on_delivery" && !isDone && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 inline-flex items-center gap-1 border border-amber-100">
            <AlertTriangle className="h-3 w-3" /> COD
          </span>
        )}
      </div>

      {/* ETA alert */}
      {order.etaMinutes <= 5 && !isDone && (
        <div className="mb-3 flex items-center gap-2 rounded-[10px] bg-emerald-50 border border-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700">
          <Clock3 className="h-3.5 w-3.5" />
          ETA {order.etaMinutes} min — almost there
        </div>
      )}

      {/* Stepper */}
      <DriverStatusStepper status={order.status} />
    </div>
  );
}
