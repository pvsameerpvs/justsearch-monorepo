"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { useRestaurantFulfillment } from '../use-restaurant-fulfillment';
import { getActiveCheckoutOrders } from './checkout-live-status-utils';
import { CheckoutTrackingCard } from './checkout-tracking-card';

export function CheckoutOrderStatusListScreen() {
  const router = useRouter();
  const { hydrated, orders } = useRestaurantFulfillment();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const activeOrders = useMemo(() => {
    if (!hydrated) {
      return [];
    }

    return getActiveCheckoutOrders(orders, now);
  }, [hydrated, now, orders]);

  useEffect(() => {
    if (hydrated && activeOrders.length === 0) {
      router.replace('/profile/orders');
    }
  }, [activeOrders.length, hydrated, router]);

  if (!hydrated) {
    return (
      <section className="py-4 sm:py-6">
        <Container className="max-w-2xl">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-[110px] animate-pulse rounded-[24px] border border-[rgb(var(--border)/0.56)] bg-white/70"
              />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (activeOrders.length === 0) {
    return (
      <section className="py-4 sm:py-6">
        <Container className="max-w-2xl">
          <div className="h-[220px] animate-pulse rounded-[24px] border border-[rgb(var(--border)/0.56)] bg-white/70" />
        </Container>
      </section>
    );
  }

  return (
    <section className="py-4 sm:py-6">
      <Container className="max-w-2xl">
        <div className="space-y-3">
          <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.96] p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
              {activeOrders.length} current orders
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[rgb(var(--ink))]">
              Live order tracking
            </h2>
            <p className="mt-1 text-[12px] leading-5 text-[rgb(var(--muted))]">
              Tap any active order below to open its live status screen.
            </p>
          </Surface>

          <CheckoutTrackingCard orders={activeOrders} />
        </div>
      </Container>
    </section>
  );
}
