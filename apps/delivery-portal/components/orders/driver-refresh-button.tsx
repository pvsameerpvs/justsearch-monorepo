"use client";

import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type DriverRefreshButtonProps = {
  onRefresh: () => void;
  isRefreshing: boolean;
};

export function DriverRefreshButton({ onRefresh, isRefreshing }: DriverRefreshButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onRefresh}
      whileTap={{ scale: 0.9 }}
      disabled={isRefreshing}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border transition",
        isRefreshing
          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
          : "border-slate-200 bg-white text-slate-500 active:bg-slate-50"
      )}
    >
      <motion.div animate={{ rotate: isRefreshing ? 360 : 0 }} transition={{ duration: 0.8, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}>
        <RefreshCw className="h-4 w-4" />
      </motion.div>
    </motion.button>
  );
}
