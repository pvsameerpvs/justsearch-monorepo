"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import type { IncomingOrder } from "@/lib/hooks/use-order-notification";

interface DriverIncomingOrderContentProps {
  order: IncomingOrder;
  totalOrders: number;
}

export function DriverIncomingOrderContent({ order, totalOrders }: DriverIncomingOrderContentProps) {
  return (
    <>
      <div className="flex flex-col items-center text-center">
        <motion.div
          animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.4 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-4"
        >
          <Bell className="h-10 w-10 text-emerald-600" />
        </motion.div>

        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wide">NEW ORDER</h2>
        <p className="text-sm font-semibold text-emerald-600 mt-1">
          {totalOrders > 1 ? `${totalOrders} orders incoming!` : "Order incoming!"}
        </p>
      </div>

      <div className="mt-5 rounded-[18px] border border-slate-100 bg-slate-50 p-4 text-center">
        <p className="text-3xl font-black text-slate-900">{order.code}</p>
        <p className="text-sm font-semibold text-slate-700 mt-1">{order.customerName}</p>
        <p className="mt-2 text-lg font-black text-emerald-700">{order.orderValue}</p>
      </div>
    </>
  );
}
