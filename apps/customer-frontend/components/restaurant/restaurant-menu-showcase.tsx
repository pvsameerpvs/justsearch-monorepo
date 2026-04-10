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
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Derived menu metrics
  const allItems = restaurant.menu.flatMap((category) => category.items);
  const availableItems = allItems.filter((item) => item.isAvailable);
  const priceValues = allItems.map((item) => item.price);
  const currency = allItems[0]?.currency ?? 'AED';
  const lowestPrice = priceValues.length > 0 ? Math.min(...priceValues) : 0;

  return (
    <>
      <RestaurantMenuHero
        restaurant={restaurant}
        itemCount={allItems.length}
        lowestPrice={lowestPrice}
        currency={currency}
      />

      <section className="relative -mt-12 pb-20 sm:pb-24 lg:pb-32">
        <Container>
          <RestaurantMenuNavigation
            restaurant={restaurant}
            availableItemsCount={availableItems.length}
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
