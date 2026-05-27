'use client';

import { motion } from 'framer-motion';
import {
  Bike,
  Gamepad2,
  LayoutDashboard,
  MonitorSmartphone,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PlatformFeature, PlatformIcon } from '@/lib/types/eatygo.types';

const ICONS: Record<PlatformIcon, LucideIcon> = {
  qr: QrCode,
  delivery: Bike,
  game: Gamepad2,
  dashboard: LayoutDashboard,
  website: MonitorSmartphone,
  admin: ShieldCheck,
};

const ICON_COLORS: Record<PlatformIcon, string> = {
  qr: 'bg-lagoon/10 text-lagoon',
  delivery: 'bg-tomato/10 text-tomato',
  game: 'bg-saffron/10 text-saffron',
  dashboard: 'bg-ink/10 text-ink',
  website: 'bg-lagoon/10 text-lagoon',
  admin: 'bg-saffron/10 text-saffron',
};

interface PlatformFeatureCardProps {
  feature: PlatformFeature;
}

export function PlatformFeatureCard({ feature }: PlatformFeatureCardProps) {
  const Icon = ICONS[feature.icon];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-[#fbfaf7] p-6 transition-shadow duration-500 hover:shadow-[0_12px_40px_rgba(16,24,32,0.08)]"
    >
      {/* Top gradient accent line */}
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-lagoon/40 via-tomato/30 to-saffron/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <span
        className={`grid h-12 w-12 place-items-center rounded-xl ${ICON_COLORS[feature.icon]} transition-transform duration-500 group-hover:scale-110`}
      >
        <Icon size={22} aria-hidden="true" strokeWidth={2} />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-ink">{feature.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{feature.detail}</p>
    </motion.article>
  );
}
