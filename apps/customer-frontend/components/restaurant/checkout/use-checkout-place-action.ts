"use client";

import { useState } from 'react';
import { ApiError } from '@/lib/api/client';
import { useRegistration } from '@/components/auth/registration-context';
import type { PlaceApi, PromoApi, AddressApi } from './checkout-place-action.types';

export function useCheckoutPlaceAction(
  validation: { isValid: boolean; errors: string[] },
  placeOrder: (data: { address: string; note: string; promoCode?: string; promoDiscount?: number; paymentMethod?: 'cash' | 'card' }) => Promise<string | null>,
  place: PlaceApi,
  promo: PromoApi,
  address: AddressApi,
  getCombinedAddress: () => string,
  restaurantNote: string,
  paymentMethod: 'cash' | 'card',
) {
  const { clearUser } = useRegistration();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warn, setWarn] = useState<string | null>(null);

  const onPlaceOrder = async () => {
    if (place.placingOrder) return;
    if (!validation.isValid) { place.setPlaceError(validation.errors[0] ?? 'Cannot place order'); return; }
    setIsSubmitting(true);
    setWarn(null);

    const isAlreadySaved = address.addresses.some((saved) => saved.address.trim() === address.address.trim() && saved.label === address.addressTitle);

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
        setWarn('Address could not be saved to your profile, but your order will still be placed.');
      }
    }

    try {
      const orderId = await placeOrder({ address: getCombinedAddress(), note: restaurantNote, promoCode: promo.appliedVoucher?.code, promoDiscount: promo.discount || undefined, paymentMethod });
      if (!orderId) { place.setPlaceError('Failed to create order. Please try again.'); return; }
      promo.consumePromo();
      place.startPlacing(orderId);
    } catch (e) {
      place.setPlaceError(e instanceof Error ? e.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { onPlaceOrder, isSubmitting, warn };
}
