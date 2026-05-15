"use client";

import { useOrderStatusQuery } from '@/lib/hooks/use-order-status-query';
import type { Restaurant } from '@/lib/restaurant-types';
import { CheckoutLiveOrderStatusPresenter } from './checkout-live-order-status-presenter';

export function CheckoutLiveOrderStatusScreen({
  restaurant,
  orderId,
}: {
  restaurant: Restaurant;
  orderId: string;
}) {
  const { data, isLoading } = useOrderStatusQuery(orderId);

  if (isLoading) {
    return (
      <section className="py-4 sm:py-6">
        <div className="mx-auto max-w-2xl space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[120px] animate-pulse rounded-[24px] border border-[rgb(var(--border)/0.56)] bg-white/70" />
          ))}
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="py-4 sm:py-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-slate-500">Order not found</p>
        </div>
      </section>
    );
  }

  return <CheckoutLiveOrderStatusPresenter order={data} restaurant={restaurant} />;
}
