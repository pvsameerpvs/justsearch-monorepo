'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { HeroMetric } from '@/lib/types/eatygo.types';
import { HeroActions } from './hero-actions';
import { HeroFeaturePanel } from './hero-feature-panel';
import { HeroMetrics } from './hero-metrics';
import { HeroTagList } from './hero-tag-list';

interface EatygoHeroProps {
  metrics: HeroMetric[];
  tags: string[];
}

export function EatygoHero({ metrics, tags }: EatygoHeroProps) {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] overflow-hidden bg-ink text-white">
      <Image
        src="/images/eatygo-hero.png"
        alt="Elegant restaurant dishes arranged for delivery ordering"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Multi-layer gradient for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(16,24,32,0.92)_0%,rgba(16,24,32,0.65)_45%,rgba(16,24,32,0.25)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,124,137,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(233,79,55,0.08),transparent_50%)]" />

      {/* Floating ambient orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-lagoon/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -left-20 bottom-1/4 h-64 w-64 rounded-full bg-tomato/8 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold backdrop-blur-md"
          >
            <Sparkles size={16} className="text-saffron" aria-hidden="true" />
            Your restaurant, your brand, your link
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-display text-6xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
          >
            Eatygo
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-xl text-lg leading-8 text-white/85"
          >
            Every restaurant gets its own branded link, QR code, delivery app, and dashboard.
            One platform to run your website, table ordering, delivery, games, and loyalty.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroActions />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <HeroTagList tags={tags} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <HeroFeaturePanel />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <HeroMetrics metrics={metrics} />
        </motion.div>
      </div>
    </section>
  );
}
