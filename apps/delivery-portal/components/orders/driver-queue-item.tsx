import { MapPin, Clock, Phone, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { statusColors } from "./driver-queue-utils";
import type { DeliveryOrder } from "@/lib/delivery-types";

type DriverQueueItemProps = {
  order: DeliveryOrder;
  index: number;
};

export function DriverQueueItem({ order, index }: DriverQueueItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="w-full rounded-[18px] border border-slate-200 bg-white p-3.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
              {index + 1}
            </span>
            <span className="text-sm font-bold text-slate-900">{order.code}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold", statusColors[order.status])}>
              {order.status.replace(/_/g, " ")}
            </span>
            {order.priority === "rush" && (
              <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[9px] font-bold text-red-600 inline-flex items-center gap-0.5">
                <Zap className="h-2.5 w-2.5" /> RUSH
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-700">{order.customerName}</p>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {order.neighborhood || "Delivery"}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {order.etaMinutes}m</span>
            <span className="font-bold text-slate-700">{order.orderValue}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <motion.a
            href={`tel:${order.customerPhone.replace(/\s/g, '')}`}
            whileTap={{ scale: 0.92 }}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1.5 text-[10px] font-bold text-white active:bg-emerald-700 transition"
          >
            <Phone className="h-3 w-3" /> Call
          </motion.a>
          {order.paymentMode === "cash_on_delivery" && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-100">COD</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
