"use client";

import { useMemo, useState } from 'react';
import { useRestaurantFulfillment } from '../fulfillment';
import { useCheckoutAddress } from './use-checkout-address';
import { useCheckoutPromo } from './use-checkout-promo';
import { useCheckoutPlace } from './use-checkout-place';
import { getCheckoutLineTotal } from './checkout.constants';
import { ApiError } from '@/lib/api/client';
import { useRegistration } from '@/components/auth/registration-context';
import { useCheckoutValidation } from './use-checkout-validation';

export function useCheckoutState() {
  const { cart, cartCount, total, deliverySavings, placeOrder } = useRestaurantFulfillment();
  const address = useCheckoutAddress();
  const promo = useCheckoutPromo(total);
  const place = useCheckoutPlace();
  const { isRegistered, user, clearUser } = useRegistration();

  const [restaurantNote, setRestaurantNote] = useState('');
  const [riderNote, setRiderNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validation = useCheckoutValidation(
    address.address,
    isRegistered,
    cartCount,
    Boolean(place.placingOrder)
  );

  const displayItems = useMemo(
    () => cart.map((item) => ({ ...item, lineTotal: getCheckoutLineTotal(item) })),
    [cart]
  );

  const promoDiscount = promo.discount;
  const displayTotal = Math.max(0, total - promoDiscount);
  const displaySavings = deliverySavings + promoDiscount;

  const onApplyPromo = (code: string) => {
    if (!code) {
      setAppliedPromoCode(null);
      promo.setPromoCode('');
      return;
    }
    promo.setPromoCode(code);
    promo.applyPromoCode();
    setAppliedPromoCode(code);
  };

  const onPlaceOrder = async () => {
    if (place.placingOrder) return;

    if (!validation.isValid) {
      place.setPlaceError(validation.errors[0] ?? 'Cannot place order');
      return;
    }

    setIsSubmitting(true);

    // Auto-save address to DB if it's a new address (not from saved list)
    const isAlreadySaved = address.addresses.some(
      (saved) =>
        saved.address.trim() === address.address.trim() &&
        saved.label === address.addressTitle
    );

    if (!isAlreadySaved && address.address.trim().length >= 5) {
      try {
        await address.addAddress({
          label: (address.addressTitle as 'Home' | 'Work' | 'Other') || 'Home',
          address: address.address.trim(),
          details: address.addressDetails.trim(),
          alternateNumber: address.alternateNumber || undefined,
        });
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          clearUser();
          place.setPlaceError('Session expired. Please sign in again.');
          setIsSubmitting(false);
          return;
        }
        // Non-blocking for other errors: log but still proceed with order
        console.error('Failed to save address:', e);
      }
    }

    const combinedAddress = [
      `${address.addressTitle} - ${address.address}`,
      address.addressDetails,
      address.alternateNumber ? `Alt number: ${address.alternateNumber}` : '',
      riderNote ? `Note for rider: ${riderNote}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const orderId = await placeOrder({
        address: combinedAddress,
        note: restaurantNote,
        promoCode: promo.appliedVoucher?.code,
        promoDiscount: promo.discount || undefined,
        paymentMethod,
      });

      if (!orderId) {
        place.setPlaceError('Failed to create order. Please try again.');
        return;
      }

      promo.consumePromo();
      place.startPlacing(orderId);
    } catch (e) {
      place.setPlaceError(e instanceof Error ? e.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    cartCount,
    total,
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
    promoDiscount: promo.discount,
    appliedPromoCode,
    onApplyPromo,
    error: place.error,
    placedOrderId: place.placedOrderId,
    placingOrder: place.placingOrder,
    placingProgress: place.placingProgress,
    isSubmitting,
    onPlaceOrder,
    isCheckoutValid: validation.isValid,
    checkoutErrors: validation.errors,
  };
}
