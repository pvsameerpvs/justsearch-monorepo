"use client";

import { Container } from '@/components/shared/container';
import type { Restaurant } from '@/lib/restaurant-types';
import { CheckoutAddressBlock } from './checkout/checkout-address-block';
import { CheckoutOrderPlacingOverlay } from './checkout/checkout-order-placing-overlay';
import { CheckoutSummaryCard } from './checkout/checkout-summary-card';
import { CheckoutStickyFooter } from './checkout/checkout-sticky-footer';
import { CheckoutEmptyState } from './checkout/checkout-empty-state';
import { useCheckoutState } from './checkout/use-checkout-state';

export function RestaurantCheckoutScreen({ restaurant }: { restaurant: Restaurant }) {
  const state = useCheckoutState(restaurant);
  if (state.cartCount === 0 && !state.placingOrder) {
    return <CheckoutEmptyState />;
  }

  return (
    <section
      className="py-6 sm:py-8"
      style={{ paddingBottom: 'calc(var(--restaurant-mobile-nav-height,0px) + 140px)' }}
    >
      <Container className="max-w-3xl">
        <div className="space-y-5">
          <CheckoutAddressBlock state={state} />

          <CheckoutSummaryCard
            restaurantName={restaurant.name}
            displayItems={state.displayItems}
            displaySavings={state.displaySavings}
            currency={state.currency}
            onApplyPromo={state.onApplyPromo}
            promoDiscount={state.promoDiscount}
            appliedPromoCode={state.appliedPromoCode}
            subtotal={state.subtotal}
            deliveryFee={state.deliveryFee}
            total={state.displayTotal}
            isDeliveryEnabled={state.isDeliveryEnabled}
            deliveryDistanceKm={state.deliveryDistanceKm}
          />
        </div>
      </Container>

      <CheckoutStickyFooter
        total={state.displayTotal}
        currency={state.currency}
        error={state.error}
        latestOrderId={state.placedOrderId}
        cartCount={state.cartCount}
        isPlacing={Boolean(state.placingOrder) || state.isSubmitting}
        isValid={state.isCheckoutValid}
        onPlaceOrder={state.onPlaceOrder}
        deliveryUnavailable={state.isDeliveryEnabled && !state.deliveryAvailable && state.coords.hasCoords}
      />

      {state.placingOrder && <CheckoutOrderPlacingOverlay progress={state.placingProgress} />}
    </section>
  );
}
