"use client";

import { Container } from '@/components/shared/container';
import type { Restaurant } from '@/lib/restaurant-types';
import { MenuSectionsList } from './menu-sections-list';
import { RestaurantMenuHero } from './restaurant-menu-hero';
import { RestaurantMenuNavigation } from './restaurant-menu-navigation';
import { DeliveryCartSection } from './delivery-cart-section';
import { useMenuShowcaseState, type ViewMode } from './use-menu-showcase-state';
export type { ViewMode };

interface RestaurantMenuShowcaseProps {
  restaurant: Restaurant;
}

export function RestaurantMenuShowcase({ restaurant }: RestaurantMenuShowcaseProps) {
  const state = useMenuShowcaseState(restaurant);

  return (
    <>
      <RestaurantMenuHero restaurant={restaurant} />

      <section
        className="relative -mt-12 pb-14 sm:pb-16"
        style={{ paddingBottom: state.shouldShowDeliveryCart ? 'calc(var(--restaurant-mobile-nav-height,0px) + 120px)' : undefined }}
      >
        <Container>
          <RestaurantMenuNavigation
            restaurant={restaurant}
            availableItemsCount={state.availableItemsCount}
            viewMode={state.viewMode}
            setViewMode={state.setViewMode}
            dietaryFilter={state.dietaryFilter}
            setDietaryFilter={state.setDietaryFilter}
          />

          <MenuSectionsList
            menu={state.filteredMenu}
            viewMode={state.viewMode}
            fulfillmentMode={state.mode}
            getCartQuantity={state.getQuantity}
            onAddToCart={state.addToCart}
            onUpdateCartQuantity={state.updateQuantity}
          />
        </Container>
      </section>

      {state.shouldShowDeliveryCart && (
        <DeliveryCartSection
          currency={state.currency}
          cart={state.cart}
          cartCount={state.cartCount}
          total={state.total}
          savings={state.deliverySavings}
          onUpdateQuantity={state.updateQuantity}
          onClear={state.clearCart}
          deliveryConfig={restaurant.delivery}
        />
      )}
    </>
  );
}
