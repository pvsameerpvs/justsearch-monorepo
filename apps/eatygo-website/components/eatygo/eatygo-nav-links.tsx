'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import type { NavLink } from '@/lib/types/eatygo.types';

interface EatygoNavLinksProps {
  links: NavLink[];
}

export function EatygoNavLinks({ links }: EatygoNavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className="hidden items-center gap-0.5 sm:flex">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`relative block rounded-lg px-4 py-2 text-[0.813rem] font-semibold tracking-wide transition-all duration-300 ${
                isActive
                  ? 'text-ink'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-ink'
              }`}
            >
              <span className="relative z-10">{link.label}</span>
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-lg bg-slate-100"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
