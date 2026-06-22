"use client";

import { useState, useRef, useCallback } from 'react';
import { useRegistration } from '@/components/auth/registration-context';
import type { AddressLabel } from '../use-address-book';
import type { PlaceApi, PromoApi, AddressApi } from './checkout-place-action.types';
import { useMarkScratchRewardUsedMutation } from './use-scratch-rewards';

const PLACE_ORDER_COOLDOWN_MS = 1500;
const SESSION_EXPIRED_MESSAGES = ['session expired', 'please sign in', 'please log in'];

function isSessionExpiredError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();
  return SESSION_EXPIRED_MESSAGES.some((phrase) => lower.includes(phrase));
}

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
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { openModal, setPendingAction } = useRegistration();
  const markUsed = useMarkScratchRewardUsedMutation();

  const onPlaceOrder = useCallback(async () => {
    if (place.placingOrder || isSubmitting) return;
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
      // Mark scratch reward as used on backend so it can never be reused
      if (promo.appliedVoucher?.source) {
        markUsed.mutate({ trigger: promo.appliedVoucher.source });
      }
      place.startPlacing(orderId);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to place order';
      if (isSessionExpiredError(e)) {
        setPendingAction(() => onPlaceOrder());
        openModal();
      } else {
        place.setPlaceError(message);
      }
      // Keep button disabled briefly so the user cannot spam-click on error
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
      cooldownTimer.current = setTimeout(() => setIsSubmitting(false), PLACE_ORDER_COOLDOWN_MS);
      return;
    }
    setIsSubmitting(false);
  }, [validation.isValid, validation.errors, place, promo, address, getCombinedAddress, restaurantNote, paymentMethod, lat, lng, deliveryFee, isSubmitting, openModal, setPendingAction, markUsed]);

  return { onPlaceOrder, isSubmitting, warn };
}
