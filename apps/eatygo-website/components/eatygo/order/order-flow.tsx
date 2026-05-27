'use client';

import { motion } from 'framer-motion';
import type { Highlight, OrderStep } from '@/lib/types/eatygo.types';
import { SectionHeading } from '../shared/section-heading';
import { AnimatedSection } from '../shared/animations';
import { OrderPreview } from './order-preview';

interface OrderFlowProps {
  highlights: Highlight[];
  steps: OrderStep[];
}

export function OrderFlow({ highlights, steps }: OrderFlowProps) {
  return (
    <section id="order" className="relative bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Customer experience"
            title="Ordering, delivery tracking, rewards, and games stay connected"
            description="Customers can scan a table QR code, order online, follow delivery, play restaurant games, and collect points from the same branded experience."
          />

          <div className="relative mt-10">
            {/* Timeline connector line */}
            <div className="absolute left-[1.4rem] top-4 bottom-4 w-px bg-slate-200 sm:left-[1.65rem]" />

            <ol className="relative grid gap-6">
              {steps.map(({ detail, id, label, title }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="relative grid gap-4 rounded-2xl border border-slate-100 bg-[#fbfaf7] p-5 pl-16 transition-shadow duration-300 hover:shadow-lg sm:grid-cols-[3.5rem_1fr] sm:pl-5"
                >
                  {/* Step number circle */}
                  <span className="absolute left-4 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-tomato shadow-sm sm:static sm:h-14 sm:w-14 sm:rounded-xl sm:text-base sm:text-ink sm:shadow-none sm:bg-slate-100">
                    {label}
                  </span>
                  <span>
                    <strong className="block text-lg font-semibold text-ink">{title}</strong>
                    <span className="mt-1 block text-sm leading-6 text-slate-500">{detail}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>

        <AnimatedSection delay={0.3}>
          <OrderPreview highlights={highlights} />
        </AnimatedSection>
      </div>
    </section>
  );
}
