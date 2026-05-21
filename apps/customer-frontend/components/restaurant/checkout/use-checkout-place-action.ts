"use client";

import { useState } from 'react';
import type { AddressLabel } from '../use-address-book';
import type { PlaceApi, PromoApi, AddressApi } from './checkout-place-action.types';

export function useCheckoutPlaceAction(
  validation: { isValid: boolean; errors: string[] },
  placeOrder: (data: { address: string; note: string; promoCode?: string; promoDiscount?: number; paymentMethod?: 'cash' | 'card'; alternateNumber?: string; lat?: number; lng?: number; deliveryFee?: number }) => Promise<string | null>,
  place: PlaceApi,
  promo: PromoApi,
  address: AddressApi,
  getCombinedAddress: () => string,
  restaurantNote: string,
  paymentMethod: 'cash' | 'card',
  lat?: number,
  lng?: number,
  deliveryFee?: number,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warn, setWarn] = useState<string | null>(null);

  const onPlaceOrder = async () => {
    if (place.placingOrder) return;
    if (!validation.isValid) { place.setPlaceError(validation.errors[0] ?? 'Cannot place order'); return; }
    setIsSubmitting(true);
    setWarn(null);

    const isExplicitlySelected = Boolean(address.selectedAddressId);
    const isAlreadySaved = address.addresses.some((saved) => saved.address.trim() === address.address.trim() && saved.label === address.addressTitle);

    if (!isExplicitlySelected && !isAlreadySaved && address.address.trim().length >= 5) {
      try {
        await address.addAddress({
          label: (address.addressTitle as AddressLabel) || 'Home',
          address: address.address.trim(),
          details: address.addressDetails.trim(),
          alternateNumber: address.alternateNumber || undefined,
        });
      } catch (e) {
        // Let global auth health monitor handle 401s; never destroy session locally
        setWarn('Address could not be saved to your profile, but your order will still be placed.');
      }
    }

    try {
      const orderId = await placeOrder({ address: getCombinedAddress(), note: restaurantNote, promoCode: promo.appliedVoucher?.code, promoDiscount: promo.discount || undefined, paymentMethod, alternateNumber: address.alternateNumber || undefined, lat, lng, deliveryFee });
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
