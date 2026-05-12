"use client";

import { motion } from 'framer-motion';

type AdTimerProps = {
  progress: number;
};

export function AdTimer({ progress }: AdTimerProps) {
  return (
    <div className="absolute left-0 right-0 top-0 h-1 bg-slate-200">
      <motion.div
        className="h-full bg-amber-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
