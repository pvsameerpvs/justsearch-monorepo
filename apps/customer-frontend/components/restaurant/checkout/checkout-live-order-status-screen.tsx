"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Container } from '@/components/shared/container';
import { EmptyState } from '@/components/shared/empty-state';
import type { Restaurant } from '@/lib/restaurant-types';
import { useRestaurantFulfillment } from '../use-restaurant-fulfillment';
import {
  buildFallbackRiderPhone,
  formatOrderStageEta,
  getCheckoutLiveStages,
  getCheckoutStageIndex,
  normalizeTelValue,
} from './checkout-live-status-utils';
import { CheckoutOrderTimeline } from './checkout-order-timeline';
import { StatusHeader, RiderCard, AddressItemsCard, ViewDetailsLink } from './live-status-parts';

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-[120px] animate-pulse rounded-[24px] border border-[rgb(var(--border)/0.56)] bg-white/70" />
      ))}
    </div>
  );
}

function splitAddress(address: string) {
  return address.split('\n').map((line) => line.trim()).filter(Boolean);
}

export function CheckoutLiveOrderStatusScreen({
  restaurant,
  orderId,
}: {
  restaurant: Restaurant;
  orderId: string;
}) {
  const { hydrated, orders } = useRestaurantFulfillment();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const order = useMemo(() => orders.find((entry) => entry.id === orderId) ?? null, [orderId, orders]);

  if (!hydrated) {
    return (
      <section className="py-4 sm:py-6">
        <Container className="max-w-2xl"><LoadingSkeleton /></Container>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="py-4 sm:py-6">
        <Container className="max-w-2xl">
          <EmptyState
            title="Order not found"
            description="We could not find that order in your recent checkout history."
            className="rounded-[24px] p-6 sm:p-8"
            action={
              <Link href="/menu" className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--brand))] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
                Back to menu
              </Link>
            }
          />
        </Container>
      </section>
    );
  }

  const stageIndex = getCheckoutStageIndex(order.createdAt, now, order.status);
  const liveStages = getCheckoutLiveStages(order.riderName);
  const orderCurrency = order.items[0]?.currency ?? restaurant.menu[0]?.items[0]?.currency ?? 'AED';
  const addressLines = splitAddress(order.address);
  const riderPhone = order.riderPhone ?? buildFallbackRiderPhone(order.id);
  const telValue = normalizeTelValue(riderPhone);
  const isDelivered = stageIndex === 3;
  const headline = isDelivered ? 'Order delivered' : stageIndex === 2 ? 'Delivery boy assigned' : 'Order placed';
  const supportText = isDelivered
    ? 'Delivered successfully.'
    : stageIndex === 0
      ? 'We received your order and are sending it to the restaurant.'
      : `Estimated arrival around ${formatOrderStageEta(order.createdAt)}`;

  return (
    <section className="py-4 sm:py-6">
      <Container className="max-w-2xl">
        <div className="space-y-3">
          <StatusHeader orderId={order.id} headline={headline} supportText={supportText} restaurant={restaurant} />
          <CheckoutOrderTimeline stages={liveStages} stageIndex={stageIndex} />
          <RiderCard riderName={order.riderName} riderPhone={riderPhone} telValue={telValue} isDelivered={isDelivered} />
          <AddressItemsCard addressLines={addressLines} items={order.items} total={order.total} orderCurrency={orderCurrency} />
          <ViewDetailsLink orderId={order.id} />
        </div>
      </Container>
    </section>
  );
}
