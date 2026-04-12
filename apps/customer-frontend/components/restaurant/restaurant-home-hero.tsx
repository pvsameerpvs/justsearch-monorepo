"use client";

import { useEffect, useState, useMemo } from 'react';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { getRestaurantDomain } from '@/lib/restaurant-utils';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantLogoBadge } from './restaurant-logo-badge';
import { useRestaurantFulfillment } from './use-restaurant-fulfillment';
import Link from 'next/link';
import { 
    getCheckoutStageIndex, 
    CHECKOUT_STAGE_COMPLETED_MS 
} from './checkout/checkout-live-status-utils';
import { AnimatedStatusEmoji } from './checkout/animated-status-emoji';
import { MultiOrderCircularProgress } from './checkout/multi-order-circular-progress';

type RestaurantHomeHeroProps = {
  restaurant: Restaurant;
};

export function RestaurantHomeHero({ restaurant }: RestaurantHomeHeroProps) {
  const domain = getRestaurantDomain(restaurant);
  const { hydrated, orders } = useRestaurantFulfillment(restaurant);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const activeOrders = useMemo(() => {
    if (!hydrated) return [];
    return orders
      .filter(o => getCheckoutStageIndex(o.createdAt, now, o.status) < 3)
      .sort((a, b) => a.createdAt - b.createdAt)
      .map(o => ({
        id: o.id,
        progress: Math.min(1, (now - o.createdAt) / CHECKOUT_STAGE_COMPLETED_MS)
      }));
  }, [hydrated, orders, now]);

  const showProgress = activeOrders.length > 0;
  const latestOrder = [...activeOrders].sort((a, b) => {
    const orderA = orders.find(o => o.id === a.id);
    const orderB = orders.find(o => o.id === b.id);
    return (orderB?.createdAt || 0) - (orderA?.createdAt || 0);
  })[0];
  
  const actualLatestOrder = orders.find(o => o.id === latestOrder?.id);
  const isOnTheWay = hydrated && !!actualLatestOrder?.riderName;

  return (
    <section className="pt-6 pb-4 sm:pt-8 sm:pb-6 lg:pt-5 lg:pb-3">
      <Container>
        <Surface className="relative mx-auto max-w-5xl rounded-[32px] border-[rgba(var(--card-border),0.9)] bg-[linear-gradient(145deg,rgba(var(--brand-soft),0.45),rgba(var(--card-surface),0.96),rgba(var(--accent-soft),0.48))] p-6 sm:p-8 lg:p-5">
          

          <div className="relative z-10 flex flex-col items-center gap-5 text-center sm:gap-6 lg:gap-4">
            <RestaurantLogoBadge restaurant={restaurant} size="lg" />
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--brand))]">
                Restaurant Logo
              </p>
              <h2 className="font-display text-4xl font-semibold tracking-[-0.08em] text-[rgb(var(--ink))] sm:text-5xl lg:text-4xl xl:text-5xl">
                {restaurant.name}
              </h2>
              <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-600 sm:text-base lg:text-sm lg:leading-5">
                {restaurant.tagline}
              </p>
              
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-slate-500 sm:text-sm">{domain}</p>
                
                {showProgress && (
                  <Link 
                    href={`/menu/checkout/status/${latestOrder.id}`}
                    className="flex flex-col items-center animate-in fade-in zoom-in duration-700 hover:scale-105 transition-transform active:scale-95"
                  >
                    <div className="relative h-24 w-24">
                      <MultiOrderCircularProgress 
                        orders={activeOrders} 
                        className="h-full w-full"
                      />
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <AnimatedStatusEmoji isOnTheWay={isOnTheWay} />
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Surface>
      </Container>
    </section>
  );
}
