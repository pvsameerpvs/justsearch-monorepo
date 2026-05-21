"use client";

import { useMemo, useState, useEffect } from 'react';
import type { Restaurant } from '@justsearch/utils';
import { useRestaurantFulfillment } from '../fulfillment';
import { useCheckoutAddress } from './use-checkout-address';
import { useCheckoutPromo } from './use-checkout-promo';
import { useCheckoutPlace } from './use-checkout-place';
import { getCheckoutLineTotal } from './checkout.constants';
import { useRegistration } from '@/components/auth/registration-context';
import { useCheckoutValidation } from './use-checkout-validation';
import { useCheckoutPlaceAction } from './use-checkout-place-action';
import { useCheckoutCoords } from './use-checkout-coords';
import { useDeliveryQuote } from './use-delivery-quote';
import { geocodeAddress } from './use-address-geocode';

export function useCheckoutState(restaurant: Restaurant) {
  const { cart, cartCount, deliverySavings, placeOrder } = useRestaurantFulfillment();
  const address = useCheckoutAddress();
  const coords = useCheckoutCoords();
  const promo = useCheckoutPromo(0);
  const place = useCheckoutPlace();
  const { isRegistered, user } = useRegistration();

  const deliveryConfig = restaurant.delivery;
  const isDeliveryEnabled = Boolean(deliveryConfig?.enabled);

  // Unified coordinate resolution: whenever address text or source changes,
  // resolve lat/lng automatically so delivery fee is always calculated.
  useEffect(() => {
    if (!isDeliveryEnabled) return;

    // No address selected — clear coords so quote is disabled
    if (!address.address) {
      coords.clearCoords();
      return;
    }

    // GPS / Pinned: coords were set explicitly by the selector (useGeolocation or map picker).
    // Skip geocoding to keep the precise coordinates the user confirmed.
    if (address.locationSource === 'gps' || address.locationSource === 'pinned') {
      return;
    }

    // Saved / manual / fallback: resolve coords from the address text.
    let cancelled = false;
    geocodeAddress(address.address).then((result) => {
      if (cancelled) return;
      if (result) {
        coords.setLatLng(result.lat, result.lng);
      } else {
        coords.clearCoords();
      }
    });

    return () => { cancelled = true; };
  }, [address.address, address.locationSource, isDeliveryEnabled]);

  const { data: quote, isLoading: quoteLoading } = useDeliveryQuote(
    isDeliveryEnabled,
    coords.lat,
    coords.lng
  );

  const dynamicFee = quote?.available ? (quote.fee ?? 0) : 0;
  const deliveryAvailable = !isDeliveryEnabled || (quote?.available ?? false);
  const deliveryReason = quote?.available === false ? (quote.reason ?? 'Delivery not available') : '';

  const displayItems = useMemo(() => cart.map((item) => ({ ...item, lineTotal: getCheckoutLineTotal(item) })), [cart]);
  const subtotal = useMemo(() => displayItems.reduce((sum, item) => sum + item.lineTotal, 0), [displayItems]);
  const promoDiscount = promo.discount;
  const displayTotal = Math.max(0, subtotal + dynamicFee - promoDiscount);
  const displaySavings = deliverySavings + promoDiscount;

  const [restaurantNote, setRestaurantNote] = useState('');
  const [riderNote, setRiderNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);

  const validation = useCheckoutValidation(
    address.address,
    isRegistered,
    cartCount,
    Boolean(place.placingOrder),
    isDeliveryEnabled,
    coords.hasCoords,
    deliveryAvailable,
    deliveryReason
  );

  const onApplyPromo = (code: string) => {
    if (!code) { setAppliedPromoCode(null); promo.setPromoCode(''); return; }
    promo.setPromoCode(code);
    promo.applyPromoCode();
    setAppliedPromoCode(code);
  };

  const getCombinedAddress = () => [
    `${address.addressTitle} - ${address.address}`,
    address.addressDetails,
    address.alternateNumber ? `Alt number: ${address.alternateNumber}` : '',
    riderNote ? `Note for rider: ${riderNote}` : '',
  ].filter(Boolean).join('\n');

  const { onPlaceOrder, isSubmitting, warn } = useCheckoutPlaceAction(
    validation,
    placeOrder,
    place,
    promo,
    address,
    getCombinedAddress,
    restaurantNote,
    paymentMethod,
    coords.lat,
    coords.lng,
    dynamicFee
  );

  return {
    cartCount,
    total: displayTotal,
    subtotal,
    currency: cart[0]?.currency ?? 'AED',
    ...address,
    user,
    riderNote,
    setRiderNote,
    restaurantNote,
    setRestaurantNote,
    paymentMethod,
    setPaymentMethod,
    displayItems,
    displaySavings,
    displayTotal,
    promoDiscount,
    appliedPromoCode,
    onApplyPromo,
    deliveryFee: dynamicFee,
    deliveryAvailable,
    deliveryReason,
    deliveryDistanceKm: quote?.distanceKm,
    deliveryEmirate: quote?.emirate,
    quoteLoading,
    error: place.error,
    placedOrderId: place.placedOrderId,
    placingOrder: place.placingOrder,
    placingProgress: place.placingProgress,
    isSubmitting,
    onPlaceOrder,
    isCheckoutValid: validation.isValid,
    checkoutErrors: validation.errors,
    addressSaveWarn: warn,
    coords,
    isDeliveryEnabled,
  };
}
