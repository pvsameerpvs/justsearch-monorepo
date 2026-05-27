'use client';

import { motion } from 'framer-motion';

interface PhoneMockupProps {
  src: string;
  alt: string;
  label?: string;
  delay?: number;
}

export function PhoneMockup({ src, alt, label, delay = 0 }: PhoneMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center"
    >
      <div className="relative w-[260px] sm:w-[280px]">
        {/* Phone frame */}
        <div className="relative overflow-hidden rounded-[2.5rem] border-[6px] border-ink bg-ink p-2 shadow-2xl shadow-ink/25">
          {/* Dynamic island / notch */}
          <div className="absolute left-1/2 top-3 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />

          {/* Screen */}
          <div className="relative overflow-hidden rounded-[2rem] bg-white">
            <img
              src={src}
              alt={alt}
              width={280}
              height={560}
              className="h-auto w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Reflection shine */}
        <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/10 via-transparent to-transparent" />

        {/* Side buttons */}
        <div className="absolute -left-[7px] top-24 h-8 w-[3px] rounded-l-sm bg-[#2a2a2a]" />
        <div className="absolute -left-[7px] top-36 h-12 w-[3px] rounded-l-sm bg-[#2a2a2a]" />
        <div className="absolute -right-[7px] top-32 h-16 w-[3px] rounded-r-sm bg-[#2a2a2a]" />
      </div>

      {label && (
        <span className="mt-4 text-sm font-semibold text-slate-500">{label}</span>
      )}
    </motion.div>
  );
}
