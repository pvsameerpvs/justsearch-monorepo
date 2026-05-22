"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useRegistration } from './registration-context';

const RESTRICTED_PREFIXES = [
  '/menu/checkout',
  '/profile',
  '/eat-play/profile',
];

function isRestrictedPath(pathname: string): boolean {
  return RESTRICTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function AuthGuard() {
  const pathname = usePathname();
  const { isRegistered, isModalOpen, openModal } = useRegistration();
  const wasModalOpenRef = useRef(false);

  // Guard restricted pages when not registered
  useEffect(() => {
    const wasModalOpen = wasModalOpenRef.current;
    wasModalOpenRef.current = isModalOpen;

    if (isRegistered) return;
    if (isModalOpen) return;
    if (!isRestrictedPath(pathname)) return;

    if (wasModalOpen) {
      // User closed modal without logging in — redirect away from restricted page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      return;
    }

    openModal();
  }, [pathname, isRegistered, isModalOpen, openModal]);

  // If registered state becomes false while on restricted page, force modal
  useEffect(() => {
    if (isRegistered) return;
    if (isModalOpen) return;
    if (!isRestrictedPath(pathname)) return;
    openModal();
  }, [isRegistered, pathname, isModalOpen, openModal]);

  return null;
}
