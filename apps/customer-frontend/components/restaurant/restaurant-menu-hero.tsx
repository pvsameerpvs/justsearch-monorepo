"use client";

import Image from 'next/image';
import { Container } from '@/components/shared/container';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantLogoBadge } from './restaurant-logo-badge';
import { DeliveryBadge } from './delivery-badge';
import { OpeningTodayCard } from './opening-today-card';

interface RestaurantMenuHeroProps {
  restaurant: Restaurant;
}

export function RestaurantMenuHero({ restaurant }: RestaurantMenuHeroProps) {
  const todayHours =
    restaurant.openingHours.find((entry) => entry.isToday)?.hours ??
    restaurant.openingHours[0]?.hours ??
    'Open today';

  const backgroundImage = restaurant.heroImageUrl ?? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070';

  return (
    <section className="relative w-full overflow-hidden -mt-[var(--restaurant-mobile-header-height,0px)] pt-[var(--restaurant-mobile-header-height,0px)]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image src={backgroundImage} alt="Menu Hero Background" fill className="object-cover brightness-[0.45] animate-subtle-zoom" sizes="100vw" priority />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <Container className="relative z-10 flex flex-col items-center justify-center py-10 sm:py-14 lg:py-16">
        <div className="flex w-full flex-col items-center text-center">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <RestaurantLogoBadge restaurant={restaurant} size="lg" className="h-20 w-20 shadow-[0_15px_40px_rgba(0,0,0,0.3)]" />
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[rgb(var(--brand))]">{restaurant.category}</p>
                <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">{restaurant.name}</h1>
                <p className="mx-auto max-w-lg text-sm text-white/80 sm:text-base font-medium">{restaurant.tagline}</p>
              </div>
            </div>

            <h2 className="mx-auto font-display text-xl font-medium leading-relaxed text-white/90 sm:text-2xl lg:max-w-2xl">
              Signature dishes, thoughtful plating, and a menu that feels great on every screen.
            </h2>

            <div className="flex flex-wrap justify-center gap-2">
              {restaurant.cuisine.map((cuisine) => (
                <span key={cuisine} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/60">
                  {cuisine}
                </span>
              ))}
            </div>

            <DeliveryBadge />
            <OpeningTodayCard hours={todayHours} />
          </div>
        </div>
      </Container>
    </section>
  );
}
