"use client";

import { motion } from 'framer-motion';

interface VipTierProgressProps {
  nextTierName: string;
  pointsToNextTier: number;
  progressPercent: number;
  color: string;
}

export function VipTierProgress({
  nextTierName,
  pointsToNextTier,
  progressPercent,
  color,
}: VipTierProgressProps) {
  return (
    <div className="mt-4">
      <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
        <span>Progress to {nextTierName}</span>
        <span>{pointsToNextTier.toLocaleString()} pts needed</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          className="h-full rounded-full transition-all"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
