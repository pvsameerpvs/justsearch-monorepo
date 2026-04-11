"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { useMeasuredCssVarHeight } from '@/components/layout/use-measured-css-var-height';

const routeTitles: Record<string, string> = {
  '/menu': 'Menu',
  '/menu/checkout': 'Checkout',
  '/eat-play': 'Games',
  '/google-reviews': 'Reviews',
  '/social-media': 'Social',
  '/profile': 'Profile',
  '/profile/points': 'Points',
  '/profile/rewards': 'Rewards',
  '/profile/how-to-play': 'How to Play',
  '/profile/settings': 'Settings',
};

const gameTitles: Record<string, string> = {
  'spin-wheel': 'Spin the Wheel',
  'scratch-card': 'Scratch Card',
  'tap-challenge': 'Tap Challenge',
  'quick-quiz': 'Quick Quiz',
};

function getHeaderTitle(pathname: string) {
  if (routeTitles[pathname]) {
    return routeTitles[pathname];
  }

  if (pathname.startsWith('/profile/')) {
    return 'Profile';
  }

  if (pathname.startsWith('/eat-play/')) {
    const gameId = pathname.split('/').filter(Boolean).at(1) ?? '';
    return gameTitles[gameId] ?? 'Game';
  }

  return 'JustSearch';
}

function getBackHref(pathname: string) {
  if (pathname.startsWith('/menu/')) {
    return '/menu';
  }

  if (pathname.startsWith('/profile/')) {
    return '/profile';
  }

  if (pathname.startsWith('/eat-play/')) {
    return '/eat-play';
  }

  return '/';
}

export function RestaurantMobileHeader() {
  const pathname = usePathname();
  const containerRef = useMeasuredCssVarHeight('--restaurant-mobile-header-height');

  const title = useMemo(() => getHeaderTitle(pathname), [pathname]);
  const backHref = useMemo(() => getBackHref(pathname), [pathname]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-x-0 top-0 z-[9999] w-full"
    >
      <div className="px-3 pb-3 pt-[calc(env(safe-area-inset-top,0px)+12px)]">
        <div className="flex items-center justify-between gap-3 rounded-[28px] border border-[rgb(var(--border)/0.9)] bg-white/85 px-4 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.10)] backdrop-blur-3xl">
          <Link
            href={backHref}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white/70 text-[rgb(var(--ink))] shadow-sm transition-all active:scale-90"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-sm font-bold tracking-tight text-[rgb(var(--ink))]">
              {title}
            </p>
          </div>

          <Link
            href="/profile"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.9)] bg-[rgb(var(--brand-soft)/0.7)] text-[rgb(var(--brand))] shadow-sm transition-all active:scale-90"
            aria-label="Profile"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
