"use client";

import { motion } from "framer-motion";

export function TransitionLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60"
    >
      <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-md">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400" style={{ animationDelay: '150ms' }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </motion.div>
  );
}
