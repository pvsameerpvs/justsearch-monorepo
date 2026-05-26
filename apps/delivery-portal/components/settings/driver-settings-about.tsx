"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";

export function DriverSettingsAbout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.09 }}
      className="rounded-[20px] border border-slate-200 bg-white p-4"
    >
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
        <Info className="h-3.5 w-3.5" /> About
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">App version</span>
          <span className="font-semibold text-slate-900">v1.0.0</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Platform</span>
          <span className="font-semibold text-slate-900">JustSearch</span>
        </div>
      </div>
    </motion.div>
  );
}
