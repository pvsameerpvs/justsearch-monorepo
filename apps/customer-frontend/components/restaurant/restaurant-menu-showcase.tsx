"use client";

import { useState } from 'react';
import { Container } from '@/components/shared/container';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantDeliveryCartBar } from './restaurant-delivery-cart-bar';
import { RestaurantDeliveryCartSheet } from './restaurant-delivery-cart-sheet';
import { RestaurantMenuCategoryCard } from './restaurant-menu-category-card';
import { RestaurantMenuHero } from './restaurant-menu-hero';
import { RestaurantMenuNavigation } from './restaurant-menu-navigation';
import { useRestaurantFulfillment } from './use-restaurant-fulfillment';

type RestaurantMenuShowcaseProps = {
  restaurant: Restaurant;
};

export type ViewMode = 'grid' | 'list';

export function RestaurantMenuShowcase({
  restaurant,
}: RestaurantMenuShowcaseProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  const {
    mode,
    setMode,
    cart,
    cartCount,
    deliverySavings,
    total,
    getQuantity,
    addToCart,
    updateQuantity,
    clearCart,
  } = useRestaurantFulfillment(restaurant);

  const availableItemsCount = restaurant.menu
    .flatMap((category) => category.items)
    .filter((item) => item.isAvailable).length;

  const currency = cart[0]?.currency ?? restaurant.menu[0]?.items[0]?.currency ?? 'AED';
  const shouldShowDeliveryCart = mode === 'delivery' && cartCount > 0;

  return (
    <>
      <RestaurantMenuHero 
        restaurant={restaurant} 
        fulfillmentMode={mode}
        setFulfillmentMode={setMode}
      />

      <section
        className="relative -mt-12 pb-14 sm:pb-16"
        style={{
          paddingBottom: shouldShowDeliveryCart
            ? 'calc(var(--restaurant-mobile-nav-height,0px) + 120px)'
            : undefined,
        }}
      >
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
                  fulfillmentMode={mode}
                  getCartQuantity={getQuantity}
                  onAddToCart={addToCart}
                  onUpdateCartQuantity={updateQuantity}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {shouldShowDeliveryCart ? (
        <>
          <RestaurantDeliveryCartBar
            currency={currency}
            cartCount={cartCount}
            total={total}
            savings={deliverySavings}
            onOpenCart={() => setIsCartSheetOpen(true)}
          />

          <RestaurantDeliveryCartSheet
            open={isCartSheetOpen}
            currency={currency}
            cart={cart}
            total={total}
            savings={deliverySavings}
            onClose={() => setIsCartSheetOpen(false)}
            onClear={clearCart}
            onUpdateQuantity={updateQuantity}
          />
        </>
      ) : null}
    </>
  );
}
