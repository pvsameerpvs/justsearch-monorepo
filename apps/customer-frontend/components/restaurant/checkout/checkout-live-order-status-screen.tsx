"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Bike, Check, ChevronRight, MapPin, Phone } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { EmptyState } from '@/components/shared/empty-state';
import { Surface } from '@/components/shared/surface';
import { RestaurantLogoBadge } from '@/components/restaurant/restaurant-logo-badge';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { Restaurant } from '@/lib/restaurant-types';
import { useRestaurantFulfillment } from '../use-restaurant-fulfillment';
import {
  buildFallbackRiderPhone,
  formatOrderStageEta,
  getCheckoutLiveStages,
  getCheckoutStageIndex,
  normalizeTelValue,
} from './checkout-live-status-utils';

type CheckoutLiveOrderStatusScreenProps = {
  restaurant: Restaurant;
  orderId: string;
};

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-[120px] animate-pulse rounded-[24px] border border-[rgb(var(--border)/0.56)] bg-white/70"
        />
      ))}
    </div>
  );
}

function splitAddress(address: string) {
  return address
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function CheckoutLiveOrderStatusScreen({
  restaurant,
  orderId,
}: CheckoutLiveOrderStatusScreenProps) {
  const { hydrated, orders } = useRestaurantFulfillment(restaurant);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const order = useMemo(
    () => orders.find((entry) => entry.id === orderId) ?? null,
    [orderId, orders],
  );

  if (!hydrated) {
    return (
      <section className="py-4 sm:py-6">
        <Container className="max-w-2xl">
          <LoadingSkeleton />
        </Container>
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
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--brand))] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
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
  const orderCurrency =
    order.items[0]?.currency ?? restaurant.menu[0]?.items[0]?.currency ?? 'AED';
  const addressLines = splitAddress(order.address);
  const riderPhone = order.riderPhone ?? buildFallbackRiderPhone(order.id);
  const telValue = normalizeTelValue(riderPhone);
  const headline =
    stageIndex === 3
      ? 'Order delivered'
      : stageIndex === 2
        ? 'Delivery boy assigned'
        : 'Order placed';
  const supportText =
    stageIndex === 3
      ? 'Delivered successfully.'
      : stageIndex === 0
        ? 'We received your order and are sending it to the restaurant.'
        : `Estimated arrival around ${formatOrderStageEta(order.createdAt)}`;

  return (
    <section className="py-4 sm:py-6">
      <Container className="max-w-2xl">
        <div className="space-y-3">
          <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.96] p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                  Order #{order.id}
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[rgb(var(--ink))]">
                  {headline}
                </h2>
                <p className="mt-1 text-[12px] text-[rgb(var(--muted))]">
                  {supportText}
                </p>
              </div>

              <Link
                href="/menu"
                className="shrink-0 rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                aria-label={`Open ${restaurant.name} menu`}
              >
                <RestaurantLogoBadge
                  restaurant={restaurant}
                  size="sm"
                  className="h-11 w-11 rounded-[18px] border-[rgb(var(--border)/0.6)] shadow-none ring-0"
                />
              </Link>
            </div>
          </Surface>

          <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.96] p-4 shadow-sm">
            <div className="space-y-0">
              {liveStages.map((stage, index) => {
                const isDone = index <= stageIndex;
                const isCurrent = index === stageIndex;
                const isLast = index === liveStages.length - 1;

                return (
                  <div key={stage.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          'mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border',
                          isDone
                            ? 'border-[rgb(var(--brand))] bg-[rgb(var(--brand))] text-white'
                            : 'border-[rgb(var(--border))] bg-white text-transparent',
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      {!isLast ? (
                        <span
                          className={cn(
                            'mt-1 h-9 w-px',
                            index < stageIndex
                              ? 'bg-[rgb(var(--brand))]'
                              : 'bg-[rgb(var(--border)/0.9)]',
                          )}
                        />
                      ) : null}
                    </div>

                    <div className={cn('pb-4', isLast && 'pb-0')}>
                      <p
                        className={cn(
                          'text-sm font-semibold',
                          isCurrent || isDone
                            ? 'text-[rgb(var(--ink))]'
                            : 'text-[rgb(var(--muted))]',
                        )}
                      >
                        {stage.label}
                      </p>
                      <p className="mt-0.5 text-[12px] leading-5 text-[rgb(var(--muted))]">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Surface>

          <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.96] p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--brand-soft)/0.36)] text-[rgb(var(--brand))]">
                  <Bike className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                    Delivery boy
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-[rgb(var(--ink))]">
                    {order.riderName}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[rgb(var(--muted))]">{riderPhone}</p>
                </div>
              </div>

              {stageIndex < 3 ? (
                <a
                  href={`tel:${telValue}`}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.82)] bg-white text-[rgb(var(--ink))] transition-colors hover:bg-[rgb(var(--card-surface-muted)/0.5)]"
                  aria-label="Call delivery boy"
                >
                  <Phone className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </Surface>

          <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.96] p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--accent-soft)/0.42)] text-[rgb(var(--accent))]">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                  Deliver to
                </p>
                {addressLines.slice(0, 3).map((line) => (
                  <p
                    key={line}
                    className="mt-1 text-sm leading-5 text-[rgb(var(--ink))] first:font-semibold"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-4 border-t border-[rgb(var(--border)/0.72)] pt-3">
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <p className="min-w-0 text-[rgb(var(--ink))]">
                      {item.quantity} x {item.name}
                    </p>
                    <p className="shrink-0 font-semibold text-[rgb(var(--ink))]">
                      {formatCurrency(item.price * item.quantity, item.currency)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[rgb(var(--border)/0.72)] pt-3 text-sm font-semibold text-[rgb(var(--ink))]">
                <span>Total</span>
                <span>{formatCurrency(order.total, orderCurrency)}</span>
              </div>
            </div>
          </Surface>

          <Link
            href={`/profile/orders/${encodeURIComponent(order.id)}`}
            className="inline-flex w-full items-center justify-between rounded-[22px] border border-[rgb(var(--border)/0.72)] bg-white px-4 py-3 text-sm font-semibold text-[rgb(var(--ink))] shadow-sm"
          >
            View full order details
            <ChevronRight className="h-4 w-4 text-[rgb(var(--muted))]" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
