"use client";

import { useMemo, useState, useEffect } from 'react';
import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { EmptyState } from '@/components/shared/empty-state';
import type { Restaurant } from '@/lib/restaurant-types';


/* Modular Components Imported from the Checkout Folder */
import { CheckoutAddressCard } from './checkout/checkout-address-card';
import { CheckoutSummaryCard } from './checkout/checkout-summary-card';
import { CheckoutStickyFooter } from './checkout/checkout-sticky-footer';
import { useRestaurantFulfillment } from './use-restaurant-fulfillment';
import { useAddressBook } from './use-address-book';

function getCheckoutLineTotal(item: {
  price: number;
  quantity: number;
  lineTotal?: number;
}) {
  return typeof item.lineTotal === 'number' ? item.lineTotal : item.price * item.quantity;
}

export function RestaurantCheckoutScreen({ restaurant }: { restaurant: Restaurant }) {
  const {
    setMode,
    cart,
    cartCount,
    total,
    deliverySavings,
    placeOrder,
  } = useRestaurantFulfillment(restaurant);

  const { addresses, addAddress } = useAddressBook();
  
  /* Centralized Checkout State */
  const [addressTitle, setAddressTitle] = useState('Home');
  const [address, setAddress] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');
  const [handoff, setHandoff] = useState('Hand it to me');
  const [restaurantNote, setRestaurantNote] = useState('');
  const [riderNote, setRiderNote] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  // Sync with first saved address on load
  useEffect(() => {
    if (addresses.length > 0 && !address) {
      setAddressTitle(addresses[0].label);
      setAddress(addresses[0].address);
      setAddressDetails(addresses[0].details);
      setAlternateNumber(addresses[0].alternateNumber || '');
    }
  }, [addresses, address]);

  const onSwitchAddress = () => {
    if (addresses.length <= 1) return;
    
    const currentIndex = addresses.findIndex(a => a.address === address);
    const nextIndex = (currentIndex + 1) % addresses.length;
    const nextAddr = addresses[nextIndex];
    
    setAddressTitle(nextAddr.label);
    setAddress(nextAddr.address);
    setAddressDetails(nextAddr.details);
    setAlternateNumber(nextAddr.alternateNumber || '');
  };

  const currency = cart[0]?.currency ?? restaurant.menu[0]?.items[0]?.currency ?? 'AED';

  const displayItems = useMemo(
    () =>
      cart.map((item) => ({
        ...item,
        lineTotal: getCheckoutLineTotal(item),
      })),
    [cart],
  );

  const displayTotal = total;
  const displaySavings = deliverySavings;

  const onPlaceOrder = () => {
    setMode('delivery');

    const combinedAddress = `${addressTitle} - ${address}\n${addressDetails}\n${handoff}${riderNote ? `\nNote for rider: ${riderNote}` : ''}`;
    const orderId = placeOrder({
      address: combinedAddress,
      note: restaurantNote,
    });

    if (!orderId) {
      setError('Add at least one item and a delivery address before placing the order.');
      return;
    }

    setError(null);
    setPlacedOrderId(orderId);
  };

  /* Empty State View */
  if (cartCount === 0) {
    return (
      <section className="py-8 sm:py-10">
        <Container className="max-w-3xl">
          <EmptyState
            title="No delivery items yet"
            description="Add menu items in delivery mode, then come here to review address, summary, and place the order."
            action={
              <ButtonLink href="/menu" variant="primary" size="md">
                Back to menu
              </ButtonLink>
            }
          />
        </Container>
      </section>
    );
  }

  return (
    <section 
      className="py-6 sm:py-8"
      style={{ 
        paddingBottom: 'calc(var(--restaurant-mobile-nav-height,0px) + 140px)' 
      }}
    >
      <Container className="max-w-3xl">
        <div className="space-y-5">
          
          {/* 1. Address & Handoff Section */}
          <CheckoutAddressCard 
            addressTitle={addressTitle}
            address={address}
            addressDetails={addressDetails}
            alternateNumber={alternateNumber}
            handoff={handoff}
            setAddress={setAddress}
            setAddressDetails={setAddressDetails}
            setAlternateNumber={setAlternateNumber}
            setHandoff={setHandoff}
            note={riderNote}
            setNote={setRiderNote}
            onSwitch={addresses.length > 1 ? onSwitchAddress : undefined}
            onSaveToProfile={() => addAddress({
              label: addressTitle as any,
              address: address,
              details: addressDetails,
              alternateNumber: alternateNumber
            })}
          />

          {/* 2. Order Summary Section */}
          <CheckoutSummaryCard 
            restaurantName={restaurant.name}
            displayItems={displayItems}
            displaySavings={displaySavings}
            currency={currency}
            note={restaurantNote}
            setNote={setRestaurantNote}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
          />
          
        </div>
      </Container>

      {/* 4. Sticky Payment Bar */}
      <CheckoutStickyFooter 
        total={displayTotal}
        currency={currency}
        error={error}
        latestOrderId={placedOrderId}
        cartCount={cartCount}
        onPlaceOrder={onPlaceOrder}
      />
    </section>
  );
}
