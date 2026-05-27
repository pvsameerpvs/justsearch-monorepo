'use client';

import { motion } from 'framer-motion';
import { PhoneMockup } from './phone-mockup';

const APP_SCREENS = [
  {
    src: '/images/app/coupon-scratch.jpeg',
    alt: 'Scratch card coupon reveal with 15% OFF welcome offer',
    label: 'Rewards & Coupons',
  },
  {
    src: '/images/app/restaurant-profile.png',
    alt: 'Restaurant profile page showing Hot Grill branding and menu link',
    label: 'Restaurant Profile',
  },
  {
    src: '/images/app/food-menu.png',
    alt: 'Food menu with starters, chef selection, and AED pricing',
    label: 'Digital Menu',
  },
  {
    src: '/images/app/delivery-tracking.png',
    alt: 'Live delivery tracking with map, order status, and cash collection',
    label: 'Delivery Tracking',
  },
  {
    src: '/images/app/delivery-tracking-2.png',
    alt: 'Delivery agent view with order assignment and rider flow',
    label: 'Rider App',
  },
];

export function MobileShowcaseSection() {
  return (
    <section id="app" className="relative overflow-hidden bg-ink px-4 py-24 sm:px-6 lg:px-8">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,124,137,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(233,79,55,0.08),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm font-bold uppercase tracking-widest text-saffron"
          >
            The Eatygo Experience
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]"
          >
            Built for every screen, ready for every order
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/60"
          >
            From customer ordering and scratch-card rewards to delivery tracking and QR table codes — the full platform in your pocket.
          </motion.p>
        </div>

        {/* Phone grid */}
        <div className="flex flex-wrap justify-center gap-8 lg:gap-10">
          {APP_SCREENS.map((screen, i) => (
            <PhoneMockup
              key={screen.label}
              src={screen.src}
              alt={screen.alt}
              label={screen.label}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
