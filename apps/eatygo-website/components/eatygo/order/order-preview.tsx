'use client';

import { motion } from 'framer-motion';
import { Bike, CheckCircle2, Clock3, PackageCheck, ShoppingBag } from 'lucide-react';
import type { Highlight } from '@/lib/types/eatygo.types';

interface OrderPreviewProps {
  highlights: Highlight[];
}

const STATUS_STEPS = [
  { icon: CheckCircle2, label: 'Kitchen accepted salmon yuzu bowl', color: 'text-lagoon', active: true },
  { icon: Clock3, label: 'Packing with chilled citrus tea', color: 'text-saffron', active: true },
  { icon: Bike, label: 'Rider pickup in 4 minutes', color: 'text-tomato', active: false },
];

export function OrderPreview({ highlights }: OrderPreviewProps) {
  return (
    <motion.aside
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-[#fbfaf7] p-6 shadow-[0_24px_64px_rgba(16,24,32,0.12)]"
    >
      {/* Top accent */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-lagoon via-tomato to-saffron" />

      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lagoon opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lagoon" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-lagoon">Live order</p>
          </div>
          <h3 className="mt-1.5 text-2xl font-semibold tracking-tight text-ink">Miso Market</h3>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white shadow-lg shadow-ink/20">
          <ShoppingBag size={22} aria-hidden="true" />
        </span>
      </div>

      <div className="grid gap-4 py-6">
        {STATUS_STEPS.map(({ icon: Icon, label, color, active }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
            className={`flex items-center gap-3.5 ${active ? 'opacity-100' : 'opacity-50'}`}
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${color}`}>
              <Icon size={16} aria-hidden="true" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-medium text-ink">{label}</span>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
          className="flex items-center gap-3.5 opacity-40"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm text-slate-400">
            <PackageCheck size={16} aria-hidden="true" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-medium text-slate-400">Arriving at 13:08</span>
        </motion.div>
      </div>

      <dl className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-100 bg-white p-4">
        {highlights.map(({ label, value }) => (
          <div key={label} className="text-center">
            <dt className="text-xs font-medium text-slate-400">{label}</dt>
            <dd className="mt-1 text-sm font-bold text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </motion.aside>
  );
}
