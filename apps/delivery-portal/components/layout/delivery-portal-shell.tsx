import type { ReactNode } from 'react';
import Link from 'next/link';
import { PortalNav } from './portal-nav';
import { RestaurantLogo } from '@/components/ui/restaurant-logo';
import type { DeliveryAgent, DeliveryPortalRestaurant } from '@/lib/delivery-types';

type DeliveryPortalShellProps = {
  restaurant: DeliveryPortalRestaurant;
  agent: DeliveryAgent;
  children: ReactNode;
};

export function DeliveryPortalShell({
  restaurant,
  agent,
  children,
}: DeliveryPortalShellProps) {
  const initial = agent.name.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="safe-header sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 px-3 pb-2.5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-slate-50/80 py-1 pl-1.5 pr-2.5 shadow-inner shadow-white/60">
            <RestaurantLogo
              name={restaurant.name}
              logoUrl={restaurant.logoUrl}
              size="nav"
            />
            {/* <div className="min-w-0">
              <h2 className="truncate text-[14px] font-semibold leading-tight text-slate-950">
                {restaurant.name}
              </h2>
              <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
                {restaurant.zoneLabel}
              </p>
            </div> */}
          </div>

          <Link
            href="/settings"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-sm font-bold text-emerald-700 shadow-sm shadow-emerald-900/5 transition hover:border-emerald-200 hover:bg-emerald-100 active:scale-95"
            aria-label="Open driver settings"
            title="Settings"
          >
            {initial}
          </Link>
        </div>
      </header>

      <div className="safe-bottom mx-auto max-w-xl px-3 pt-2.5">
        <PortalNav />
        {children}
      </div>
    </main>
  );
}
