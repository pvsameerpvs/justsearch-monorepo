"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useRegistration } from './registration-context';

export function AuthRequiredHandler() {
  const searchParams = useSearchParams();
  const { isRegistered, openModal } = useRegistration();
  const handledRef = useRef(false);

  useEffect(() => {
    if (searchParams.get('auth') !== 'required') {
      handledRef.current = false;
      return;
    }
    if (isRegistered) return;
    if (handledRef.current) return;

    handledRef.current = true;
    openModal();

    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('auth');
    window.history.replaceState(null, '', newUrl.toString());
  }, [searchParams, isRegistered, openModal]);

  return null;
}
