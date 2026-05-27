'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import type { RestaurantBenefit } from '@/lib/types/eatygo.types';

interface RestaurantBenefitListProps {
  benefits: RestaurantBenefit[];
}

export function RestaurantBenefitList({ benefits }: RestaurantBenefitListProps) {
  return (
    <div className="mt-8 grid gap-4">
      {benefits.map(({ detail, id, title }, i) => (
        <motion.article
          key={id}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
        >
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-saffron/15">
            <CheckCircle2 className="text-saffron" size={18} aria-hidden="true" strokeWidth={2.5} />
          </span>
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-white/60">{detail}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
