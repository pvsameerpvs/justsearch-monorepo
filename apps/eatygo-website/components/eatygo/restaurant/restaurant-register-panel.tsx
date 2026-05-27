'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, Store } from 'lucide-react';
import { RegisterField } from './register-field';

export function RestaurantRegisterPanel() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white backdrop-blur-sm"
    >
      <div className="flex items-start gap-3 border-b border-white/10 pb-6">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-tomato text-white shadow-lg shadow-tomato/20">
          <Store size={22} aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-saffron">Register your restaurant</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight">Start with a contact request</h3>
        </div>
      </div>

      <form className="mt-6 grid gap-4">
        <RegisterField label="Restaurant name" placeholder="Example: Mosaic Grill" />
        <div className="grid gap-4 sm:grid-cols-2">
          <RegisterField label="City" placeholder="Dubai" />
          <RegisterField label="Branches" placeholder="1" inputMode="numeric" />
        </div>
        <RegisterField label="Contact number" placeholder="+971 50 000 0000" type="tel" />
        <RegisterField label="Email" placeholder="owner@restaurant.com" type="email" />
        <label className="grid gap-2 text-sm font-semibold text-white/90">
          What do you need first?
          <textarea
            className="min-h-24 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-normal text-white outline-none transition-all placeholder:text-white/30 focus:border-lagoon/50 focus:bg-white/10"
            placeholder="QR tables, delivery, website, games, or full platform"
          />
        </label>
        <button
          className="mt-1 rounded-xl bg-tomato px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-tomato/20 transition-all duration-300 hover:bg-[#d9442f] hover:shadow-xl hover:shadow-tomato/30"
          type="button"
        >
          Send registration request
        </button>
      </form>

      <div className="mt-6 grid gap-2 border-t border-white/10 pt-5 text-sm text-white/60">
        <a className="inline-flex items-center gap-2 transition-colors hover:text-saffron" href="tel:+971500000000">
          <Phone size={16} aria-hidden="true" />
          +971 50 000 0000
        </a>
        <a className="inline-flex items-center gap-2 transition-colors hover:text-saffron" href="mailto:hello@eatygo.com">
          <Mail size={16} aria-hidden="true" />
          hello@eatygo.com
        </a>
      </div>
    </motion.aside>
  );
}
