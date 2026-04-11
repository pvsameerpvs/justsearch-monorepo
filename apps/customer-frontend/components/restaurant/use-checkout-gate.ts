"use client";

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Clean Logic Gate for Restaurant Checkout
 * Ensures a user has a verified mobile number before proceeding to /checkout
 */
export function useCheckoutGate() {
  const router = useRouter();

  const handleCheckout = useCallback(() => {
    router.push('/menu/checkout');
  }, [router]);

  return { handleCheckout };
}
