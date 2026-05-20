"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { useRestaurantFulfillment } from '../use-restaurant-fulfillment';
import { useMyOrdersQuery } from '@/lib/hooks/use-my-orders-query';
import { mergeActiveOrders } from './use-active-order-list';
import { CheckoutTrackingCard } from './checkout-tracking-card';
import { CheckoutOrderStatusSkeleton } from './checkout-order-status-skeleton';

export function CheckoutOrderStatusListScreen() {
  const router = useRouter();
  const { hydrated, orders: localOrders } = useRestaurantFulfillment();
  const { data: apiOrders, isLoading: apiLoading } = useMyOrdersQuery();

  const activeOrders = mergeActiveOrders(apiOrders, localOrders);

  useEffect(() => {
    if (hydrated && !apiLoading && activeOrders.length === 0) {
      const timer = setTimeout(() => router.replace('/profile/orders'), 800);
      return () => clearTimeout(timer);
    }
  }, [activeOrders.length, hydrated, apiLoading, router]);

  if (!hydrated || apiLoading) {
    return <CheckoutOrderStatusSkeleton />;
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
              {activeOrders.length} current {activeOrders.length === 1 ? 'order' : 'orders'}
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
