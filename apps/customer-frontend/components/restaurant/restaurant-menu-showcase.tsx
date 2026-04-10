"use client";

import { useState } from 'react';
import { Container } from '@/components/shared/container';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantMenuCategoryCard } from './restaurant-menu-category-card';
import { RestaurantMenuHero } from './restaurant-menu-hero';
import { RestaurantMenuNavigation } from './restaurant-menu-navigation';

type RestaurantMenuShowcaseProps = {
  restaurant: Restaurant;
};

export type ViewMode = 'grid' | 'list';

export function RestaurantMenuShowcase({
  restaurant,
}: RestaurantMenuShowcaseProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const availableItemsCount = restaurant.menu
    .flatMap((category) => category.items)
    .filter((item) => item.isAvailable).length;

  return (
    <>
      <RestaurantMenuHero restaurant={restaurant} />

      <section className="relative -mt-12 pb-14 sm:pb-16">
        <Container>
          <RestaurantMenuNavigation
            restaurant={restaurant}
            availableItemsCount={availableItemsCount}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {/* Menu Sections List */}
          <div className="space-y-16 sm:space-y-24">
            {restaurant.menu.map((category) => (
              <div key={category.id} id={category.id} className="scroll-mt-36">
                <RestaurantMenuCategoryCard 
                  category={category} 
                  viewMode={viewMode} 
                />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
