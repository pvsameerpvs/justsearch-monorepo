'use client';

import { motion } from 'framer-motion';

const STATS = [
  { value: '120+', label: 'Restaurants onboarded', suffix: '' },
  { value: '48K', label: 'Orders delivered', suffix: '' },
  { value: '4.9', label: 'Average rating', suffix: '' },
  { value: '18', label: 'Min avg delivery', suffix: 'min' },
];

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-ink px-4 py-20 sm:px-6 lg:px-8">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,124,137,0.15),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="inline-block text-sm font-bold uppercase tracking-widest text-saffron">
            Trusted by kitchens
          </span>
          <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Numbers that speak for every dish served
          </h2>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {stat.value}
                {stat.suffix && (
                  <span className="ml-1 text-lg font-medium text-white/50">{stat.suffix}</span>
                )}
              </div>
              <p className="mt-3 text-sm font-medium text-white/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
