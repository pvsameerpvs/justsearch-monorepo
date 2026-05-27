'use client';

import { motion } from 'framer-motion';
import { Globe, LayoutDashboard, QrCode, Truck } from 'lucide-react';

const PANEL_ITEMS = [
  { label: 'Your link', icon: Globe, color: 'bg-lagoon/20 text-lagoon' },
  { label: 'Table QR', icon: QrCode, color: 'bg-saffron/20 text-saffron' },
  { label: 'Delivery app', icon: Truck, color: 'bg-tomato/20 text-tomato' },
  { label: 'Dashboard', icon: LayoutDashboard, color: 'bg-white/20 text-white' },
];

export function HeroFeaturePanel() {
  return (
    <aside className="mt-8 max-w-xl rounded-2xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-xl">
      <p className="text-sm font-semibold text-white/80">Every restaurant gets</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {PANEL_ITEMS.map(({ icon: Icon, label, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
            className="group rounded-xl bg-white/10 p-3.5 transition-all duration-300 hover:bg-white/15"
          >
            <span className={`inline-flex rounded-lg ${color} p-2`}>
              <Icon size={18} aria-hidden="true" />
            </span>
            <p className="mt-2.5 text-sm font-semibold">{label}</p>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}
