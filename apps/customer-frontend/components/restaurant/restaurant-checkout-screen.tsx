"use client";

import { useMemo, useState } from 'react';
import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { EmptyState } from '@/components/shared/empty-state';
import type { Restaurant } from '@/lib/restaurant-types';


/* Modular Components Imported from the Checkout Folder */
import { CheckoutAddressCard } from './checkout/checkout-address-card';
import { CheckoutSummaryCard } from './checkout/checkout-summary-card';
import { CheckoutTrackingCard } from './checkout/checkout-tracking-card';
import { CheckoutStickyFooter } from './checkout/checkout-sticky-footer';
import { useRestaurantFulfillment } from './use-restaurant-fulfillment';

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
    orders,
    placeOrder,
  } = useRestaurantFulfillment(restaurant);

  /* Centralized Checkout State */
  const [addressTitle, setAddressTitle] = useState('Work');
  const [address, setAddress] = useState('Dubai Damas tower, 28 Al Maktoum Road, Riggat Al Buteen, Dubai');
  const [addressDetails, setAddressDetails] = useState('305 office number');
  const [handoff, setHandoff] = useState('Hand it to me');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const currency = cart[0]?.currency ?? restaurant.menu[0]?.items[0]?.currency ?? 'AED';

  /* Logic: Determine which data to display (Current Cart vs Latest Order) */
  const latestOrder = useMemo(
    () => (placedOrderId ? orders.find((order) => order.id === placedOrderId) ?? null : null),
    [orders, placedOrderId],
  );
  
  const fallbackOrder = latestOrder ?? orders[0] ?? null;
  
  const displayItems = useMemo(
    () =>
      (cartCount > 0 ? cart : fallbackOrder?.items ?? []).map((item) => ({
        ...item,
        lineTotal: getCheckoutLineTotal(item),
      })),
    [cart, cartCount, fallbackOrder?.items],
  );

  const displayTotal = cartCount > 0 ? total : fallbackOrder?.total ?? 0;
  const displaySavings = cartCount > 0 ? deliverySavings : fallbackOrder?.deliverySavings ?? 0;

  const onPlaceOrder = () => {
    setMode('delivery');

    const combinedAddress = `${addressTitle} - ${address}\n${addressDetails}\n${handoff}${note ? `\n${note}` : ''}`;
    const orderId = placeOrder({
      address: combinedAddress,
      note,
    });

    if (!orderId) {
      setError('Add at least one item and a delivery address before placing the order.');
      return;
    }

    setError(null);
    setPlacedOrderId(orderId);
  };

  /* Empty State View */
  if (cartCount === 0 && orders.length === 0) {
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
            handoff={handoff}
            note={note}
            setAddressTitle={setAddressTitle}
            setAddress={setAddress}
            setAddressDetails={setAddressDetails}
            setHandoff={setHandoff}
            setNote={setNote}
          />

          {/* 2. Order Summary Section */}
          <CheckoutSummaryCard 
            restaurantName={restaurant.name}
            displayItems={displayItems}
            displaySavings={displaySavings}
            currency={currency}
            note={note}
            setNote={setNote}
          />

          {/* 3. Order History & Tracking Section */}
          <CheckoutTrackingCard 
            orders={orders}
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
