import type { ReactNode } from 'react';
import { Bike } from 'lucide-react';
import { AgentInfoCard } from './agent-info-card';
import { PortalNav } from './portal-nav';
import { PortalMetaStrip } from './portal-meta-strip';
import type { DeliveryAgent, DeliveryPortalRestaurant } from '@/lib/delivery-types';

type DeliveryPortalShellProps = {
  restaurant: DeliveryPortalRestaurant;
  agent: DeliveryAgent;
  routeHealthLabel: string;
  children: ReactNode;
};

export function DeliveryPortalShell({
  restaurant,
  agent,
  routeHealthLabel,
  children,
}: DeliveryPortalShellProps) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <section className="mb-8 overflow-hidden rounded-[32px] border border-orange-100 bg-white/90 shadow-[0_28px_100px_-48px_rgba(15,23,42,0.42)] backdrop-blur">
          <div className="grid gap-6 border-b border-orange-100 bg-[linear-gradient(140deg,rgba(255,247,237,0.95),rgba(255,255,255,0.98))] px-6 py-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">
                <Bike className="h-3.5 w-3.5" />
                JustSearch Dispatch
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Focused delivery operations for {restaurant.name}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  This portal keeps the delivery team on one fast interface: active
                  stops, timing, route health, and customer handoff details.
                </p>
              </div>
            </div>

            <AgentInfoCard agent={agent} routeHealthLabel={routeHealthLabel} />
          </div>

          <PortalNav />
          <PortalMetaStrip restaurant={restaurant} />
        </section>

        {children}
      </div>
    </main>
  );
}
