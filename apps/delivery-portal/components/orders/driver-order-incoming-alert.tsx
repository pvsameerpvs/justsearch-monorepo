"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DriverIncomingOrderContent } from "./driver-incoming-order-content";
import type { IncomingOrder } from "@/lib/hooks/use-order-notification";

type DriverOrderIncomingAlertProps = {
  orders: IncomingOrder[];
  onDismiss: () => void;
};

export function DriverOrderIncomingAlert({ orders, onDismiss }: DriverOrderIncomingAlertProps) {
  if (orders.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="incoming-alert"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <DriverIncomingOrderContent order={orders[0]} totalOrders={orders.length} />

          <div className="mt-5 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onDismiss}
              className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white active:bg-emerald-700 transition"
            >
              Accept Order
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-600 active:bg-slate-200 transition"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
