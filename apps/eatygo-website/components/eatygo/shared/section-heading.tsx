'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
  dark?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  dark = false,
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : '';
  const textColor = dark ? 'text-white/90' : 'text-slate-600';
  const eyebrowColor = dark ? 'text-saffron' : 'text-lagoon';

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`inline-block text-sm font-bold uppercase tracking-widest ${eyebrowColor}`}
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`mt-4 text-base leading-7 ${textColor}`}
      >
        {description}
      </motion.p>
    </div>
  );
}
