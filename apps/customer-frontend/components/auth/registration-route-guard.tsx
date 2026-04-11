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
    if (!pathname.startsWith('/eat-play') && !pathname.startsWith('/menu/checkout')) return;

    // If user closes the modal without verifying, send them home.
    if (wasModalOpen) {
      router.push('/');
      return;
    }

    openModal();
  }, [pathname, isRegistered, isModalOpen, openModal, router]);

  return null;
}
