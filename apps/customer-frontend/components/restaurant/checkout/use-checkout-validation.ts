"use client";

import { useMemo } from 'react';
import { z } from 'zod';

const checkoutGuardSchema = z.object({
  address: z.string().min(5, 'Please add a delivery address'),
  isRegistered: z.literal(true, {
    errorMap: () => ({ message: 'Please sign in to place an order' }),
  }),
  cartCount: z.number().min(1, 'Your cart is empty'),
});

export type CheckoutValidation = {
  isValid: boolean;
  errors: string[];
};

export function useCheckoutValidation(
  address: string,
  isRegistered: boolean,
  cartCount: number,
  isPlacing: boolean,
  isDeliveryEnabled: boolean,
  hasCoords: boolean,
  deliveryAvailable?: boolean,
  deliveryError?: string
): CheckoutValidation {
  return useMemo(() => {
    if (isPlacing) {
      return { isValid: false, errors: [] };
    }

    const result = checkoutGuardSchema.safeParse({
      address: address.trim(),
      isRegistered,
      cartCount,
    });

    const errors = result.success ? [] : result.error.issues.map((issue) => issue.message);

    if (isDeliveryEnabled && !hasCoords) {
      errors.push('Please set your delivery location to calculate the fee');
    }

    if (deliveryAvailable === false) {
      errors.push(deliveryError || 'Delivery is not available for this location');
    }

    return { isValid: errors.length === 0, errors };
  }, [address, isRegistered, cartCount, isPlacing, isDeliveryEnabled, hasCoords, deliveryAvailable, deliveryError]);
}
