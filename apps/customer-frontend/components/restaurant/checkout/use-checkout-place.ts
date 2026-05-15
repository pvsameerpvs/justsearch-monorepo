"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ORDER_PLACING_DURATION_MS } from './checkout.constants';

export function useCheckoutPlace() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState<{ orderId: string; startedAt: number } | null>(null);
  const [placingProgress, setPlacingProgress] = useState(0);

  useEffect(() => {
    if (!placingOrder) {
      setPlacingProgress(0);
      return;
    }

    let frameId = 0;
    const animate = () => {
      const elapsed = Date.now() - placingOrder.startedAt;
      const nextProgress = Math.min(1, elapsed / ORDER_PLACING_DURATION_MS);
      setPlacingProgress(nextProgress);
      if (nextProgress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    const redirectTimer = window.setTimeout(() => {
      router.push(`/menu/checkout/status/${encodeURIComponent(placingOrder.orderId)}`);
    }, ORDER_PLACING_DURATION_MS + 1000);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(redirectTimer);
    };
  }, [placingOrder, router]);

  const startPlacing = (orderId: string) => {
    setError(null);
    setPlacedOrderId(orderId);
    setPlacingOrder({ orderId, startedAt: Date.now() });
  };

  const setPlaceError = (message: string) => setError(message);

  return {
    error,
    placedOrderId,
    placingOrder,
    placingProgress,
    startPlacing,
    setPlaceError,
  };
}
