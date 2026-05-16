"use client";

import { Container } from '@/components/shared/container';
import type { Restaurant } from '@/lib/restaurant-types';
import { CheckoutAddressCard } from './checkout/checkout-address-card';
import { CheckoutAddressSelectorSheet } from './checkout/checkout-address-selector-sheet';
import { CheckoutOrderPlacingOverlay } from './checkout/checkout-order-placing-overlay';
import { CheckoutSummaryCard } from './checkout/checkout-summary-card';
import { CheckoutStickyFooter } from './checkout/checkout-sticky-footer';
import { CheckoutEmptyState } from './checkout/checkout-empty-state';
import { useCheckoutState } from './checkout/use-checkout-state';

export function RestaurantCheckoutScreen({ restaurant }: { restaurant: Restaurant }) {
  const state = useCheckoutState();

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
          <CheckoutAddressCard
            addressTitle={state.addressTitle}
            address={state.address}
            addressDetails={state.addressDetails}
            userPhone={state.user?.mobile}
            alternateNumber={state.alternateNumber}
            savedAddressesCount={state.addresses.length}
            setAlternateNumber={state.setAlternateNumber}
            note={state.riderNote}
            setNote={state.setRiderNote}
            onOpenAddressBook={() => state.setIsAddressBookOpen(true)}
            paymentMethod={state.paymentMethod}
            setPaymentMethod={state.setPaymentMethod}
          />

          <CheckoutSummaryCard
            restaurantName={restaurant.name}
            displayItems={state.displayItems}
            displaySavings={state.displaySavings}
            currency={state.currency}
            onApplyPromo={state.onApplyPromo}
            promoDiscount={state.promoDiscount}
            appliedPromoCode={state.appliedPromoCode}
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
      />

      <CheckoutAddressSelectorSheet
        open={state.isAddressBookOpen}
        addresses={state.addresses}
        selectedAddressId={state.selectedAddressId ?? undefined}
        onClose={() => state.setIsAddressBookOpen(false)}
        onSelectAddress={state.applySavedAddress}
        onAddAddress={async (newAddress) => {
          const createdAddress = await state.addAddress(newAddress);
          state.applySavedAddress(createdAddress);
        }}
        onUseCurrentLocation={state.applyCurrentLocationAddress}
      />

      {state.placingOrder && <CheckoutOrderPlacingOverlay progress={state.placingProgress} />}
    </section>
  );
}
