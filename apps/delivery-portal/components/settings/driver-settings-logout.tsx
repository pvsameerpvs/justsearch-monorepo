"use client";

import { motion } from "framer-motion";
import { LogOut, ChevronRight } from "lucide-react";

interface DriverSettingsLogoutProps {
  onLogout: () => void;
}

export function DriverSettingsLogout({ onLogout }: DriverSettingsLogoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
    >
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center justify-between rounded-[20px] border border-red-100 bg-red-50 p-4 active:bg-red-100 transition"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
            <LogOut className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-red-700">Log out</p>
            <p className="text-[11px] text-red-500">End your shift</p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-red-400" />
      </button>
    </motion.div>
  );
}
