"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Utensils, Receipt } from "lucide-react";
import type { DeliveryOrder } from "@/lib/delivery-types";

type DriverExpandableItemsProps = {
  order: DeliveryOrder;
};

export function DriverExpandableItems({ order }: DriverExpandableItemsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const currency = order.orderItems[0]?.currency ?? "AED";

  return (
    <div>
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="flex items-center gap-1"><Utensils className="h-3.5 w-3.5 text-orange-500" /> {order.itemCount} items</span>
          <span className="flex items-center gap-1"><Receipt className="h-3.5 w-3.5 text-orange-500" /> {order.orderValue}</span>
        </div>
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-700"
        >
          {showDetails ? <>Hide <ChevronUp className="h-3.5 w-3.5" /></> : <>View items <ChevronDown className="h-3.5 w-3.5" /></>}
        </button>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 border-t border-slate-100 pt-3">
              <div className="space-y-1.5">
                {order.orderItems.map((item, i) => (
                  <div key={`${item.name}-${i}`} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">{item.quantity}</span>
                      <p className="text-xs font-medium text-slate-700 truncate">{item.name}</p>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 shrink-0">{currency} {item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 rounded-[12px] border border-slate-100 bg-slate-50 p-2.5 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500"><span>Subtotal</span><span>{currency} {order.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-[11px] text-slate-500"><span>Delivery</span><span>{currency} {order.deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between text-[11px] text-slate-500"><span>Tax</span><span>{currency} {order.tax.toFixed(2)}</span></div>
                <div className="border-t border-slate-200 pt-1 flex justify-between">
                  <span className="text-xs font-bold text-slate-900">Total</span>
                  <span className="text-sm font-bold text-slate-900">{currency} {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
