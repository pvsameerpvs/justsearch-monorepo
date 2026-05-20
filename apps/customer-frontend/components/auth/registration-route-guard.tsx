"use client";

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useRegistration } from './registration-context';

export function RegistrationRouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { isRegistered, isModalOpen, openModal } = useRegistration();
  const wasModalOpenRef = useRef(false);

  useEffect(() => {
    const wasModalOpen = wasModalOpenRef.current;
    wasModalOpenRef.current = isModalOpen;

    if (isRegistered) return;
    if (isModalOpen) return;
    // Only auto-prompt for checkout; games/profile stay open without forcing login
    if (!pathname.startsWith('/menu/checkout')) return;

    if (wasModalOpen) {
      router.push('/');
      return;
    }

    openModal();
  }, [pathname, isRegistered, isModalOpen, openModal, router]);

  return null;
}
