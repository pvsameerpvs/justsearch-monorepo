"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

interface DriverSettingsProfileCardProps {
  driverName: string;
}

export function DriverSettingsProfileCard({ driverName }: DriverSettingsProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 }}
      className="rounded-[20px] border border-slate-200 bg-white p-4 flex items-center gap-3"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50">
        <User className="h-6 w-6 text-emerald-600" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate">{driverName}</p>
        <p className="text-xs text-slate-500">Delivery Agent</p>
      </div>
    </motion.div>
  );
}
