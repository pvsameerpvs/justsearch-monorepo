import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';
import { getRestaurantThemeVars } from '@/lib/theme-vars';

type AppShellProps = {
  children: ReactNode;
  className?: string;
};

export async function AppShell({ children, className }: AppShellProps) {
  const restaurant = await getCurrentRestaurant();

  return (
    <div
      style={getRestaurantThemeVars(restaurant.theme)}
      className={cn('relative min-h-screen overflow-hidden', className)}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(var(--page-bg-from),0.96),rgba(var(--page-bg-to),0.98))]" />
      <div className="pointer-events-none absolute -left-24 top-12 -z-10 h-72 w-72 rounded-full bg-[rgba(var(--page-glow-brand),0.16)] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-32 -z-10 h-80 w-80 rounded-full bg-[rgba(var(--page-glow-accent),0.18)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-56 w-56 rounded-full bg-[rgba(var(--brand-soft),0.32)] blur-3xl" />
      <main className="relative">{children}</main>
    </div>
  );
}
