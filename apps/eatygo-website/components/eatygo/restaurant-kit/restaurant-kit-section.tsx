'use client';

import { motion } from 'framer-motion';
import { Globe, LayoutDashboard, QrCode, Truck } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '../shared/animations';

const KIT_ITEMS = [
  {
    icon: Globe,
    title: 'Your own link',
    detail: 'A branded website like yourname.eatygo.com that customers visit directly for your menu, ordering, and loyalty.',
    color: 'bg-lagoon/10 text-lagoon border-lagoon/20',
    number: '01',
  },
  {
    icon: QrCode,
    title: 'Your own QR code',
    detail: 'Every table gets a unique QR code. Customers scan, browse, order, and earn rewards without waiting for staff.',
    color: 'bg-saffron/10 text-saffron border-saffron/20',
    number: '02',
  },
  {
    icon: Truck,
    title: 'Your own delivery app',
    detail: 'Receive delivery orders, assign riders, track live on map, and collect cash — all under your brand.',
    color: 'bg-tomato/10 text-tomato border-tomato/20',
    number: '03',
  },
  {
    icon: LayoutDashboard,
    title: 'Your own dashboard',
    detail: 'Manage menus, QR codes, live orders, staff, vouchers, customer lists, and analytics in one place.',
    color: 'bg-ink/8 text-ink border-ink/10',
    number: '04',
  },
];

export function RestaurantKitSection() {
  return (
    <section className="relative bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm font-bold uppercase tracking-widest text-tomato"
          >
            What every restaurant gets
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]"
          >
            Your restaurant, your brand, your tools
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-500"
          >
            Every restaurant on Eatygo receives four essentials: a branded link, table QR codes, a delivery system, and a full operations dashboard.
          </motion.p>
        </div>

        <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
          {KIT_ITEMS.map((item) => (
            <StaggerItem key={item.number}>
              <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-[#fbfaf7] p-6 transition-all duration-500 hover:border-slate-200 hover:shadow-[0_12px_40px_rgba(16,24,32,0.08)]">
                {/* Top gradient accent */}
                <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-lagoon via-tomato to-saffron opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="flex items-center justify-between">
                  <span className={`grid h-12 w-12 place-items-center rounded-xl ${item.color.split(' ').slice(0, 2).join(' ')}`}>
                    <item.icon size={22} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <span className="font-display text-3xl font-semibold text-slate-200">
                    {item.number}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.detail}</p>

                {/* Bottom badge */}
                <span className={`mt-5 inline-block rounded-lg border px-3 py-1.5 text-xs font-semibold ${item.color}`}>
                  Included free
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
