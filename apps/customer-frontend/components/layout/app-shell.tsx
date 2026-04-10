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
      className={cn('relative min-h-screen overflow-hidden bg-white', className)}
    >
      <main className="relative pb-[var(--restaurant-mobile-nav-height,0px)] pt-[var(--restaurant-mobile-header-height,0px)]">
        {children}
      </main>
    </div>
  );
}
