'use client';

import { motion } from 'framer-motion';
import type { HeroMetric } from '@/lib/types/eatygo.types';

interface HeroMetricsProps {
  metrics: HeroMetric[];
}

export function HeroMetrics({ metrics }: HeroMetricsProps) {
  return (
    <dl className="mt-8 grid max-w-3xl gap-4 border-t border-white/15 pt-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map(({ label, value }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 + i * 0.12, duration: 0.5 }}
        >
          <dt className="text-sm text-white/60">{label}</dt>
          <dd className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{value}</dd>
        </motion.div>
      ))}
    </dl>
  );
}
