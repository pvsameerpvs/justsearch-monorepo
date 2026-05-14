"use client";

import { motion, useTransform } from "framer-motion";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSlideAction } from "./hooks/use-slide-action";
import { DriverPaymentSheet } from "./driver-payment-sheet";
import { DriverSlideDone } from "./driver-slide-done";
import { DriverSlideCodBadge } from "./driver-slide-cod-badge";
import type { DeliveryOrder, DeliveryOrderStatus } from "@/lib/delivery-types";

const NEXT_LABELS: Record<DeliveryOrderStatus, string> = {
  assigned: "Slide to pick up", picked_up: "Slide to start route",
  on_route: "Slide to mark arrived", arrived: "Slide to complete", delivered: "Completed",
};

const STATUS_BG: Record<DeliveryOrderStatus, string> = {
  assigned: "bg-slate-100", picked_up: "bg-emerald-50", on_route: "bg-emerald-50",
  arrived: "bg-emerald-50", delivered: "bg-emerald-50",
};

const STATUS_TEXT: Record<DeliveryOrderStatus, string> = {
  assigned: "text-slate-500", picked_up: "text-emerald-600", on_route: "text-emerald-600",
  arrived: "text-emerald-600", delivered: "text-emerald-600",
};

type DriverSlideButtonProps = {
  order: DeliveryOrder;
  onUpdateStatus: (orderId: string, status: DeliveryOrderStatus) => void;
};

export function DriverSlideButton({ order, onUpdateStatus }: DriverSlideButtonProps) {
  if (order.status === "delivered") return <DriverSlideDone />;

  const { x, containerRef, isDragging, isComplete, showPaymentPicker, setIsDragging, doStatusUpdate, handleDragEnd, handleCancel } = useSlideAction(order, onUpdateStatus);
  const maxDrag = (containerRef.current?.offsetWidth ?? 300) - 56;

  return (
    <>
      <div className="px-4 pb-4 pt-1">
        <div ref={containerRef} className={cn("relative h-14 rounded-full overflow-hidden select-none", STATUS_BG[order.status])}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn("text-sm font-bold transition-opacity duration-200", STATUS_TEXT[order.status], isDragging && "opacity-0")}>
              {isComplete ? "Done!" : NEXT_LABELS[order.status]}
            </span>
          </div>
          <motion.div className="absolute top-0 left-0 h-full bg-emerald-500" style={{ width: useTransform(x, (v) => `${Math.max(0, (v / maxDrag) * 100)}%`) }} />
          <motion.div drag="x" dragConstraints={{ left: 0, right: maxDrag }} dragElastic={0.1} dragMomentum={false}
            onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd} style={{ x }}
            className="absolute top-1 left-1 h-12 w-12 rounded-full bg-emerald-600 shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing z-10" whileTap={{ scale: 0.95 }}>
            <motion.div animate={{ rotate: isComplete ? 0 : isDragging ? 90 : 0 }} transition={{ duration: 0.2 }}>
              {isComplete ? <CheckCircle2 className="h-5 w-5 text-white" /> : <ChevronRight className="h-5 w-5 text-white" />}
            </motion.div>
          </motion.div>
        </div>
        <DriverSlideCodBadge order={order} />
      </div>
      <DriverPaymentSheet order={order} open={showPaymentPicker} onConfirm={doStatusUpdate} onCancel={handleCancel} xMotionValue={x} />
    </>
  );
}
