"use client";

import { motion, AnimatePresence, animate } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { Banknote, CreditCard } from "lucide-react";
import { DriverPaymentItems } from "./driver-payment-items";
import type { DeliveryOrder, DeliveryOrderStatus } from "@/lib/delivery-types";

type DriverPaymentSheetProps = {
  order: DeliveryOrder;
  open: boolean;
  onConfirm: (status: DeliveryOrderStatus) => void;
  onCancel: () => void;
  xMotionValue: MotionValue<number>;
};

export function DriverPaymentSheet({ order, open, onConfirm, onCancel, xMotionValue }: DriverPaymentSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => {
              onCancel();
              animate(xMotionValue, 0, { type: "spring", stiffness: 500, damping: 30 });
            }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px] bg-white p-5 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] shadow-[0_-8px_40px_rgba(15,23,42,0.25)]"
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-300" />
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="text-center">
                <h2 className="text-lg font-bold text-slate-900">Confirm handoff</h2>
                <p className="mt-1 text-sm text-slate-500">Collect payment from {order.customerName}</p>
              </div>
              <DriverPaymentItems order={order} />
              <div className="grid grid-cols-2 gap-3">
                <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => onConfirm("delivered")} className="flex flex-col items-center gap-2 rounded-[18px] border border-emerald-200 bg-emerald-50 p-4 active:bg-emerald-100 transition">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100"><Banknote className="h-6 w-6 text-emerald-600" /></div>
                  <span className="text-sm font-bold text-emerald-800">Cash</span>
                </motion.button>
                <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => onConfirm("delivered")} className="flex flex-col items-center gap-2 rounded-[18px] border border-emerald-200 bg-emerald-50 p-4 active:bg-emerald-100 transition">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100"><CreditCard className="h-6 w-6 text-emerald-600" /></div>
                  <span className="text-sm font-bold text-emerald-800">Card</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
