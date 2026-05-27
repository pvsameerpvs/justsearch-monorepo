'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, ArrowUpRight } from 'lucide-react';
import type { NavLink } from '@/lib/types/eatygo.types';
import { EatygoLogo } from './eatygo-logo';
import { EatygoMobileNav } from './eatygo-mobile-nav';
import { EatygoNavLinks } from './eatygo-nav-links';

interface EatygoHeaderProps {
  links: NavLink[];
}

export function EatygoHeader({ links }: EatygoHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-30"
    >
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? 'border-b border-black/[0.05] bg-[#fbfaf7]/90 shadow-[0_1px_2px_rgba(16,24,32,0.03)] backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        >
          <EatygoLogo />
          <EatygoNavLinks links={links} />
          <div className="flex items-center gap-3">
            <EatygoMobileNav links={links} />
            <Link
              href="/register"
              className="group hidden items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-[0.813rem] font-bold tracking-wide text-white shadow-lg shadow-ink/10 transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#1a2a3a] hover:shadow-xl hover:shadow-ink/20 sm:inline-flex"
            >
              <Store size={15} aria-hidden="true" strokeWidth={2.5} />
              <span>Register</span>
              <ArrowUpRight
                size={14}
                className="opacity-60 transition-all duration-300 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] group-hover:opacity-100"
                aria-hidden="true"
                strokeWidth={2.5}
              />
            </Link>
          </div>
        </nav>
      </div>

      {/* Elegant bottom gradient line that appears on scroll */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-px origin-left bg-gradient-to-r from-transparent via-lagoon/30 to-transparent"
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}
