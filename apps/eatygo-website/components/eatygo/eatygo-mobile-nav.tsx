'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import type { NavLink } from '@/lib/types/eatygo.types';
import { EatygoLogo } from './eatygo-logo';

interface EatygoMobileNavProps {
  links: NavLink[];
}

export function EatygoMobileNav({ links }: EatygoMobileNavProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-300 hover:text-ink active:scale-95"
      >
        <Menu size={18} strokeWidth={2.5} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm"
              onClick={close}
            />

            {/* Sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 h-full w-[min(20rem,85vw)] bg-white shadow-2xl shadow-ink/10"
            >
              <div className="flex h-[4.5rem] items-center justify-between border-b border-slate-100 px-5">
                <EatygoLogo showText={false} />
                <button
                  onClick={close}
                  aria-label="Close menu"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-ink"
                >
                  <X size={18} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>

              <nav className="flex flex-col gap-1 p-4">
                {links.map(({ href, label }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
                  >
                    <Link
                      href={href}
                      onClick={close}
                      className="group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-ink"
                    >
                      <span>{label}</span>
                      <ArrowUpRight
                        size={14}
                        className="opacity-0 transition-all duration-200 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] group-hover:opacity-100"
                        strokeWidth={2.5}
                      />
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.35 }}
                  className="mt-3 border-t border-slate-100 pt-4"
                >
                  <Link
                    href="/register"
                    onClick={close}
                    className="flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3.5 text-sm font-bold tracking-wide text-white shadow-lg shadow-ink/15"
                  >
                    Register restaurant
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
