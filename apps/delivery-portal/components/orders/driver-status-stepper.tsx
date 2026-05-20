"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { DeliveryOrderStatus } from "@/lib/delivery-types";

const STEPS: { key: DeliveryOrderStatus; label: string }[] = [
  { key: "assigned", label: "Assigned" },
  { key: "picked_up", label: "Picked up" },
  { key: "on_route", label: "On route" },
  { key: "delivered", label: "Done" },
];

const STATUS_INDEX: Record<DeliveryOrderStatus, number> = {
  assigned: 0, picked_up: 1, on_route: 2, delivered: 3, cancelled: -1,
};

type DriverStatusStepperProps = {
  status: DeliveryOrderStatus;
};

export function DriverStatusStepper({ status }: DriverStatusStepperProps) {
  const current = STATUS_INDEX[status];

  return (
    <div className="flex items-center justify-between">
      {STEPS.map((step, i) => {
        const done = i <= current;
        const active = i === current && status !== "delivered";
        return (
          <div key={step.key} className="flex flex-col items-center gap-1">
            <motion.div
              initial={false}
              animate={{ scale: active ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 1.5, repeat: active ? Infinity : 0, ease: "easeInOut" }}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black border",
                done ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-400"
              )}
            >
              {done && i < current ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </motion.div>
            <span className={cn("text-[9px] font-bold uppercase tracking-wider", done ? "text-emerald-700" : "text-slate-300")}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
