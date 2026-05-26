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
      {/* Elegant top bar — clean, minimal */}
      <header className="sticky top-0 z-40 bg-white px-4 pb-3.5 safe-header">
        <div className="mx-auto max-w-xl flex items-center justify-between">
          {/* Left: Restaurant */}
          <div className="flex items-center gap-3 min-w-0">
            <RestaurantLogo name={restaurant.name} logoUrl={restaurant.logoUrl} size="sm" />
            <div className="min-w-0">
              <h2 className="text-[15px] font-bold text-slate-900 truncate leading-tight">
                {restaurant.name}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium truncate">{restaurant.zoneLabel}</p>
            </div>
          </div>

          {/* Right: Elegant avatar */}
          <Link
            href="/settings"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold ring-2 ring-emerald-100 hover:bg-emerald-700 active:scale-95 transition"
            title="Settings"
          >
            {initial}
          </Link>
        </div>
      </header>

      {/* Elegant nav */}
      <div className="mx-auto max-w-xl px-4 pt-2 safe-bottom">
        <PortalNav />
        {children}
      </div>
    </main>
  );
}
