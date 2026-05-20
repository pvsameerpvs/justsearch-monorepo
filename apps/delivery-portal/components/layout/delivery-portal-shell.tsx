import type { ReactNode } from 'react';
import Link from 'next/link';
import { Bike } from 'lucide-react';
import { PortalNav } from './portal-nav';
import { DriverLogoutButton } from './driver-logout-button';
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
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Simple top bar — uses existing orange brand color */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto max-w-xl flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Bike className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                {restaurant.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">{restaurant.zoneLabel}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/earnings">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 active:bg-emerald-100 transition">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {agent.name}
              </span>
            </Link>
            <DriverLogoutButton />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-3 pb-20 pt-3 sm:px-4">
        <PortalNav />
        {children}
      </div>
    </main>
  );
}
