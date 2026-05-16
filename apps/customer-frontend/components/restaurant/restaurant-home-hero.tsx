"use client";

import { useEffect, useMemo, useState } from 'react';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { getRestaurantDomain } from '@/lib/restaurant-utils';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantLogoBadge } from './restaurant-logo-badge';
import { Leaf } from 'lucide-react';
import {
  getCheckoutOrderSummaries,
  getCheckoutStatusHref,
} from './checkout/checkout-live-status-utils';
import { RestaurantHomeHeroProgress } from './restaurant-home-hero-progress';
import { useRestaurantFulfillment } from './use-restaurant-fulfillment';

type RestaurantHomeHeroProps = {
  restaurant: Restaurant;
};

export function RestaurantHomeHero({ restaurant }: RestaurantHomeHeroProps) {
  const domain = getRestaurantDomain(restaurant);
  const { hydrated, orders } = useRestaurantFulfillment();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const activeOrders = useMemo(() => {
    if (!hydrated) return [];
    return getCheckoutOrderSummaries(orders);
  }, [hydrated, orders, now]);

  const showProgress = activeOrders.length > 0;
  const statusHref = getCheckoutStatusHref(activeOrders.map((order) => order.id));
  const isOnTheWay = activeOrders[activeOrders.length - 1]?.isOnTheWay ?? false;

  return (
    <section className="pt-6 pb-4 sm:pt-8 sm:pb-6 lg:pt-5 lg:pb-3">
      <Container>
        <Surface className="relative mx-auto max-w-5xl rounded-[32px] border-[rgba(var(--card-border),0.9)] bg-[linear-gradient(145deg,rgba(var(--brand-soft),0.45),rgba(var(--card-surface),0.96),rgba(var(--accent-soft),0.48))] p-6 sm:p-8 lg:p-5">
          <div className="relative z-10 flex flex-col items-center gap-5 text-center sm:gap-6 lg:gap-4">
            <RestaurantLogoBadge restaurant={restaurant} size="lg" />
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--brand))]">
                {restaurant.category}
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <h2 className="font-display text-4xl font-semibold tracking-[-0.08em] text-[rgb(var(--ink))] sm:text-5xl lg:text-4xl xl:text-5xl">
                  {restaurant.name}
                </h2>
                {restaurant.isPureVeg && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                    <Leaf className="h-3.5 w-3.5" />
                    Pure Veg
                  </span>
                )}
              </div>
              <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-600 sm:text-base lg:text-sm lg:leading-5">
                {restaurant.tagline}
              </p>
              {restaurant.description && (
                <p className="mx-auto max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm lg:text-xs lg:leading-4">
                  {restaurant.description}
                </p>
              )}
              {restaurant.cuisine.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {restaurant.cuisine.map((c, i) => (
                    <span
                      key={`${c}-${i}`}
                      className="rounded-full border border-[rgb(var(--card-border))] bg-[rgb(var(--card-surface))] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--muted))]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-slate-500 sm:text-sm">{domain}</p>
                
                {showProgress && statusHref && (
                  <RestaurantHomeHeroProgress statusHref={statusHref} activeOrders={activeOrders} isOnTheWay={isOnTheWay} />
                )}
              </div>
            </div>
          </div>
        </Surface>
      </Container>
    </section>
  );
}
