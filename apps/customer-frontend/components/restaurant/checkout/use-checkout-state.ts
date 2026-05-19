"use client";

import { useMemo, useState } from 'react';
import { useRestaurantFulfillment } from '../fulfillment';
import { useCheckoutAddress } from './use-checkout-address';
import { useCheckoutPromo } from './use-checkout-promo';
import { useCheckoutPlace } from './use-checkout-place';
import { getCheckoutLineTotal } from './checkout.constants';
import { useRegistration } from '@/components/auth/registration-context';
import { useCheckoutValidation } from './use-checkout-validation';
import { useCheckoutPlaceAction } from './use-checkout-place-action';

export function useCheckoutState() {
  const { cart, cartCount, total, deliverySavings, placeOrder } = useRestaurantFulfillment();
  const address = useCheckoutAddress();
  const promo = useCheckoutPromo(total);
  const place = useCheckoutPlace();
  const { isRegistered, user } = useRegistration();

  const [restaurantNote, setRestaurantNote] = useState('');
  const [riderNote, setRiderNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);

  const validation = useCheckoutValidation(address.address, isRegistered, cartCount, Boolean(place.placingOrder));
  const displayItems = useMemo(() => cart.map((item) => ({ ...item, lineTotal: getCheckoutLineTotal(item) })), [cart]);
  const promoDiscount = promo.discount;
  const displayTotal = Math.max(0, total - promoDiscount);
  const displaySavings = deliverySavings + promoDiscount;

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
    validation, placeOrder, place, promo, address, getCombinedAddress, restaurantNote, paymentMethod
  );

  return {
    cartCount, total, currency: cart[0]?.currency ?? 'AED',
    ...address,
    user,
    riderNote, setRiderNote,
    restaurantNote, setRestaurantNote,
    paymentMethod, setPaymentMethod,
    displayItems, displaySavings, displayTotal,
    promoDiscount, appliedPromoCode, onApplyPromo,
    error: place.error,
    placedOrderId: place.placedOrderId,
    placingOrder: place.placingOrder,
    placingProgress: place.placingProgress,
    isSubmitting,
    onPlaceOrder,
    isCheckoutValid: validation.isValid,
    checkoutErrors: validation.errors,
    addressSaveWarn: warn,
  };
}
