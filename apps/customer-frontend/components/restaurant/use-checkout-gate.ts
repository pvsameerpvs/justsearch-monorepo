"use client";

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useRegistration } from '@/components/auth/registration-context';

/**
 * Clean Logic Gate for Restaurant Checkout
 * Ensures a user has a verified mobile number before proceeding to /checkout
 */
export function useCheckoutGate() {
  const router = useRouter();
  const { isRegistered, openModal } = useRegistration();

  const handleCheckout = useCallback(() => {
    if (!isRegistered) {
      openModal();
      return;
    }
    router.push('/menu/checkout');
  }, [router, isRegistered, openModal]);

  return { handleCheckout };
}
