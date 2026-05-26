"use client";

import { motion } from "framer-motion";
import { Truck, Bell } from "lucide-react";

export function DriverEmptyState() {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="rounded-[24px] border border-dashed border-slate-300 bg-white p-8 text-center"
    >
      <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <Truck className="h-8 w-8 text-slate-400" />
      </div>
      <p className="text-sm font-semibold text-slate-700">No active delivery</p>
      <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">
        New orders will appear here automatically. Keep your phone nearby.
      </p>
      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-600 border border-emerald-100">
        <Bell className="h-3 w-3" />
        Sound alert enabled
      </div>
    </motion.div>
  );
}
