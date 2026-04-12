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

type RestaurantHomeHeroProps = {
  restaurant: Restaurant;
};

export function RestaurantHomeHero({ restaurant }: RestaurantHomeHeroProps) {
  const domain = getRestaurantDomain(restaurant);
  const { hydrated, orders } = useRestaurantFulfillment(restaurant);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 333);
    return () => window.clearInterval(timer);
  }, []);

  const progress = useMemo(() => {
    if (!hydrated || orders.length === 0) return null;
    const latest = orders[0];
    const stageIndex = getCheckoutStageIndex(latest.createdAt, now, latest.status);
    if (stageIndex >= 3) return null;
    
    return Math.min(1, (now - latest.createdAt) / CHECKOUT_STAGE_COMPLETED_MS);
  }, [hydrated, orders, now]);

  const showProgress = progress !== null;
  const latestOrder = orders[0];
  const isOnTheWay = hydrated && latestOrder?.riderName;

  const emojis = isOnTheWay 
    ? ['🛵', '🏠', '📍', '🍱','🍔', '🍽️', '🍜', '👨‍🍳', '🌯', '🍱', '🍜', '🍲'] 
    : ['🍔', '🍽️', '🍜', '👨‍🍳', '🌯', '🍱', '🍜', '🍲'];

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
                      {/* Premium Circular Tracker */}
                      <svg className="h-full w-full -rotate-90 overflow-visible" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          className="stroke-slate-200 fill-none"
                          strokeWidth="7"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          className="stroke-[rgb(var(--brand))] fill-none transition-all duration-1000 ease-out"
                          strokeWidth="7"
                          strokeDasharray="276.46"
                          strokeDashoffset={276.46 * (1 - progress)}
                          strokeLinecap="round"
                        />
                      </svg>
                      
                      {/* Animated Central Icons (Switch 3 times per second) */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center justify-center">
                          <span className="text-3xl animate-in fade-in zoom-in duration-300" key={Math.floor(now / 333)}>
                            {emojis[Math.floor(now / 333) % emojis.length]}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Info */}
                    {/* <div className="mt-3 flex flex-col items-center gap-1">
                      <span className="text-xl font-black tracking-tight text-slate-800">
                        {Math.round(progress * 100)}%
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[rgb(var(--brand))] px-2 py-0.5 rounded-full bg-[rgb(var(--brand-soft)/0.15)]">
                        {isOnTheWay ? 'On the way' : 'Preparing'}
                      </span>
                    </div> */}
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
