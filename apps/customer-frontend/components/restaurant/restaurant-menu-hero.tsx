"use client";

import { ArrowLeft, Sparkles, UtensilsCrossed, Calendar, Tag } from 'lucide-react';
import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { formatCurrency } from '@/lib/format';
import { getRestaurantDomain } from '@/lib/restaurant-utils';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantLogoBadge } from './restaurant-logo-badge';

type RestaurantMenuHeroProps = {
  restaurant: Restaurant;
  itemCount: number;
  lowestPrice: number;
  currency: string;
};

export function RestaurantMenuHero({
  restaurant,
  itemCount,
  lowestPrice,
  currency,
}: RestaurantMenuHeroProps) {
  const todayHours =
    restaurant.openingHours.find((entry) => entry.isToday)?.hours ??
    restaurant.openingHours[0]?.hours ??
    'Open today';

  const backgroundImage = `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070`;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Immersive Full-Width Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={backgroundImage}
          alt="Menu Hero Background"
          className="h-full w-full object-cover brightness-[0.45] animate-subtle-zoom"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <Container className="relative z-10 flex flex-col items-center justify-center py-10 sm:py-14 lg:py-16">
        {/* Absolute Back Button */}
        <div className="absolute left-4 top-6 z-50 sm:left-6 sm:top-8">
          <button
            onClick={() => window.history.back()}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 active:scale-95 shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Centered Content Row */}
        <div className="flex w-full flex-col items-center text-center">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <RestaurantLogoBadge
                restaurant={restaurant}
                size="lg"
                className="h-20 w-20 shadow-[0_15px_40px_rgba(0,0,0,0.3)]"
              />
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[rgb(var(--brand))]">
                  {restaurant.category}
                </p>
                <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {restaurant.name}
                </h1>
                <p className="mx-auto max-w-lg text-sm text-white/80 sm:text-base font-medium">
                  {restaurant.tagline}
                </p>
              </div>
            </div>

            <h2 className="mx-auto font-display text-xl font-medium leading-relaxed text-white/90 sm:text-2xl lg:max-w-2xl">
              Signature dishes, thoughtful plating, and a menu that feels great on every screen.
            </h2>

            <div className="flex flex-wrap justify-center gap-2">
              {restaurant.cuisine.map((cuisine) => (
                <span
                  key={cuisine}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/60"
                >
                  {cuisine}
                </span>
              ))}
            </div>

            {/* Integrated Opening Today Timing */}
            <div className="flex justify-center py-5">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 pr-6 text-white backdrop-blur-xl transition-all hover:bg-white/10">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgb(var(--brand)/0.2)] text-[rgb(var(--brand))]">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold  uppercase tracking-widest text-white/40">Opening Today</p>
                  <p className="font-display text-sm font-bold">{todayHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
