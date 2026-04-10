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
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Menu Hero Background"
          className="h-full w-full object-cover brightness-50 animate-subtle-zoom"
        />
      </div>

      <Container className="relative z-10 py-12 sm:py-20 lg:py-28">
        {/* Absolute Back Button */}
        <div className="absolute left-4 top-8 z-50 sm:left-8 sm:top-10 lg:left-12">
          <button
            onClick={() => window.history.back()}
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 active:scale-95 shadow-lg"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          {/* Left Column: Branding & Title */}
          <div className="space-y-8">
            
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <RestaurantLogoBadge
                restaurant={restaurant}
                size="lg"
                className="shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              />
              <div className="space-y-2">
                <p className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--brand))]">
                  {restaurant.category}
                </p>
                <h1 className="font-display text-5xl font-bold tracking-tight text-white sm:text-7xl">
                  {restaurant.name}
                </h1>
                <p className="text-lg text-white/80 max-w-lg">
                  {restaurant.tagline}
                </p>
              </div>
            </div>

            <h2 className="font-display text-3xl font-medium leading-tight text-white/90 sm:text-5xl lg:max-w-xl">
              Discover a culinary journey crafted with passion and precision.
            </h2>

            <div className="flex flex-wrap gap-3">
              {restaurant.cuisine.map((cuisine) => (
                <span
                  key={cuisine}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/70"
                >
                  {cuisine}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Experience Cards */}
          <div className="grid gap-4 sm:grid-cols-1">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 text-white backdrop-blur-xl transition-all hover:bg-white/10">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[rgb(var(--brand))] opacity-10 blur-3xl" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Menu Stats</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-display text-5xl font-bold">{itemCount}</span>
                    <span className="text-sm text-white/60 font-medium">Unique Dishes</span>
                  </div>
                </div>
                <UtensilsCrossed className="h-8 w-8 text-[rgb(var(--brand))]" />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 text-white backdrop-blur-xl transition-all hover:bg-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Starting From</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-display text-5xl font-bold">{formatCurrency(lowestPrice, currency)}</span>
                    <span className="text-sm text-white/60 font-medium">per dish</span>
                  </div>
                </div>
                <Tag className="h-8 w-8 text-amber-400" />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 text-white backdrop-blur-xl transition-all hover:bg-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Opening Today</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-display text-3xl font-bold">{todayHours}</span>
                  </div>
                </div>
                <Calendar className="h-8 w-8 text-[rgb(var(--brand))]" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
