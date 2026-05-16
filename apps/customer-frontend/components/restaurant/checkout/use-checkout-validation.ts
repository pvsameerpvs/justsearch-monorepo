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
  isPlacing: boolean
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

    if (result.success) {
      return { isValid: true, errors: [] };
    }

    const errors = result.error.issues.map((issue) => issue.message);
    return { isValid: false, errors };
  }, [address, isRegistered, cartCount, isPlacing]);
}
