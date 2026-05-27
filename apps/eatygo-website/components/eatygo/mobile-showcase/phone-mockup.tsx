'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface PhoneMockupProps {
  src: string;
  alt: string;
  label?: string;
  delay?: number;
}

export function PhoneMockup({ src, alt, label, delay = 0 }: PhoneMockupProps) {
  const [error, setError] = useState(false);

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
            {error ? (
              <div className="flex h-[560px] w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-200">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-400">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                    <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="px-4 text-center text-xs font-medium text-slate-400">{label}</span>
              </div>
            ) : (
              <Image
                src={src}
                alt={alt}
                width={280}
                height={560}
                className="h-auto w-full object-cover"
                sizes="280px"
                onError={() => setError(true)}
              />
            )}
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
