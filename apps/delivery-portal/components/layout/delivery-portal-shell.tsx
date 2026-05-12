import type { ReactNode } from 'react';
import { Badge } from '@justsearch/ui';
import { Bike, Clock3, MapPin, Phone, Store } from 'lucide-react';
import type { DeliveryAgent, DeliveryPortalRestaurant } from '@/lib/delivery-types';

function getAgentBadgeVariant(
  status: DeliveryAgent['status']
): 'default' | 'success' | 'warning' {
  switch (status) {
    case 'online':
      return 'success';
    case 'busy':
      return 'warning';
    default:
      return 'default';
  }
}

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

            <div className="rounded-[28px] border border-slate-200 bg-slate-950 px-5 py-5 text-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.7)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-200">
                    Active courier
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{agent.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{agent.vehicleType}</p>
                </div>
                <Badge variant={getAgentBadgeVariant(agent.status)}>
                  {agent.status}
                </Badge>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-orange-300" />
                  <span>{agent.shiftLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-orange-300" />
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-300" />
                  <span>{routeHealthLabel}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-6 py-4 text-sm text-slate-600 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Store className="h-4 w-4 text-orange-500" />
                Restaurant tenant
              </div>
              <p className="mt-2">{restaurant.slug}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <MapPin className="h-4 w-4 text-orange-500" />
                Delivery zone
              </div>
              <p className="mt-2">{restaurant.zoneLabel}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Phone className="h-4 w-4 text-orange-500" />
                Dispatch hotline
              </div>
              <p className="mt-2">
                {restaurant.supportPhone} and {restaurant.deliveryDomain}
              </p>
            </div>
          </div>
        </section>

        {children}
      </div>
    </main>
  );
}
