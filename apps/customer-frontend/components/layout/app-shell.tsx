import type { ReactNode } from 'react';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { demoRestaurant } from '@/lib/demo-data';
import { cn } from '@/lib/cn';
import type { CSSProperties } from 'react';

type AppShellProps = {
  children: ReactNode;
  className?: string;
};

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div
      style={
        {
          '--brand': demoRestaurant.theme.brand,
          '--brand-soft': demoRestaurant.theme.brandSoft,
          '--accent': demoRestaurant.theme.accent,
          '--accent-soft': demoRestaurant.theme.accentSoft,
          '--surface': demoRestaurant.theme.surface,
          '--ink': demoRestaurant.theme.ink,
          '--muted': demoRestaurant.theme.muted,
          '--border': demoRestaurant.theme.border,
        } as CSSProperties
      }
      className={cn('relative min-h-screen overflow-hidden', className)}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.8))]" />
      <div className="pointer-events-none absolute -left-24 top-16 -z-10 h-72 w-72 rounded-full bg-[rgb(var(--brand-soft))] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-36 -z-10 h-80 w-80 rounded-full bg-[rgb(var(--accent-soft))] blur-3xl" />
      <SiteHeader />
      <main className="relative">{children}</main>
      <SiteFooter />
    </div>
  );
}
