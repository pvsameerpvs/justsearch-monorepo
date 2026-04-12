"use client";

import Link from 'next/link';
import {
  Bike,
  ChevronRight,
  MapPin,
  Receipt,
} from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { RestaurantDeliveryStatusBadge } from '@/components/restaurant/restaurant-delivery-status-badge';
import { RestaurantLogoBadge } from '@/components/restaurant/restaurant-logo-badge';
import { formatCurrency } from '@/lib/format';
import type { Restaurant } from '@/lib/restaurant-types';
import {
  formatOrderPlacedTime,
  getOrderSummaryHeadline,
  getOrderSummarySupportText,
  splitOrderAddress,
} from './profile-order-utils';
import { useProfileOrders } from './use-profile-orders';

type ProfileOrderDetailsScreenProps = {
  restaurant: Restaurant;
  orderId: string;
};

function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-[120px] animate-pulse rounded-[24px] border border-[rgb(var(--border)/0.56)] bg-white/70"
        />
      ))}
    </div>
  );
}

export function ProfileOrderDetailsScreen({
  restaurant,
  orderId,
}: ProfileOrderDetailsScreenProps) {
  const { hydrated, findOrderById } = useProfileOrders(restaurant);

  if (!hydrated) {
    return (
      <section className="py-4 sm:py-6">
        <Container className="max-w-2xl">
          <LoadingState />
        </Container>
      </section>
    );
  }

  const order = findOrderById(orderId);

  if (!order) {
    return (
      <section className="py-4 sm:py-6">
        <Container className="max-w-2xl">
          <EmptyState
            title="Order not found"
            description="We could not find that order summary in this restaurant profile."
            className="rounded-[24px] p-6 sm:p-8"
            action={
              <Link
                href="/profile/orders"
                className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--brand))] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Back to orders
              </Link>
            }
          />
        </Container>
      </section>
    );
  }

  const addressLines = splitOrderAddress(order.address);
  const orderCurrency =
    order.items[0]?.currency ?? restaurant.menu[0]?.items[0]?.currency ?? 'AED';

  return (
    <section className="py-4 sm:py-6">
      <Container className="max-w-2xl">
        

        <div className="space-y-3 sm:space-y-4">
          <Surface className="overflow-hidden rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.96] p-0 shadow-sm">
            <div className="h-2 bg-[rgb(var(--brand))]" />
            <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[rgb(var(--ink))]">
                    {getOrderSummaryHeadline(order.status)}
                  </h2>
                  <p className="mt-1 text-[12px] text-[rgb(var(--muted))] sm:text-sm">
                    Placed {formatOrderPlacedTime(order.createdAt)}
                  </p>
                </div>
                <RestaurantDeliveryStatusBadge
                  status={order.status}
                  className="w-fit px-2.5 py-1 text-[9px] tracking-[0.14em]"
                />
              </div>

              <div className="mt-4 rounded-[18px] bg-[rgb(var(--brand-soft)/0.36)] p-3.5">
                <p className="text-sm font-semibold text-[rgb(var(--brand))]">
                  Delivery update
                </p>
                <p className="mt-1 text-sm leading-5 text-[rgb(var(--muted))]">
                  {getOrderSummarySupportText(order)}
                </p>
              </div>
            </div>
          </Surface>

          <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.92] p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--brand-soft)/0.35)] text-[rgb(var(--brand))]">
                <Bike className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                  Delivery partner
                </p>
                <p className="mt-1 text-sm font-semibold text-[rgb(var(--ink))]">
                  {order.riderName}
                </p>
                <p className="mt-1 text-[12px] text-[rgb(var(--muted))]">
                  Rider assigned for this order
                </p>
              </div>
            </div>
          </Surface>

          <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.92] p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--accent-soft)/0.42)] text-[rgb(var(--accent))]">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                  Deliver to
                </p>
                {addressLines.map((line) => (
                  <p
                    key={line}
                    className="mt-1 text-sm leading-5 text-[rgb(var(--ink))] first:font-semibold first:text-[rgb(var(--ink))]"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </Surface>

          <Link
            href="/menu"
            className="block rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.92] p-4 shadow-sm transition-colors hover:bg-white">
              <div className="flex items-center gap-3">
                <RestaurantLogoBadge
                  restaurant={restaurant}
                  size="sm"
                  className="h-11 w-11 rounded-[18px] border-[rgb(var(--border)/0.6)] shadow-none ring-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                    Restaurant
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-[rgb(var(--ink))]">
                    {restaurant.name}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-[rgb(var(--muted))]" />
              </div>
            </Surface>
          </Link>

          <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.96] p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--brand-soft)/0.35)] text-[rgb(var(--brand))]">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                    Invoice
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[rgb(var(--ink))]">
                    Total
                  </p>
                </div>
              </div>
              <p className="font-display text-xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                {formatCurrency(order.total, orderCurrency)}
              </p>
            </div>

            <div className="mt-4 divide-y divide-[rgb(var(--border)/0.72)]">
              {order.items.map((item) => (
                <div
                  key={item.itemId}
                  className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[rgb(var(--ink))]">
                      {item.quantity} x {item.name}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-[rgb(var(--ink))]">
                    {formatCurrency(item.price * item.quantity, item.currency)}
                  </p>
                </div>
              ))}
            </div>

            {order.note ? (
              <div className="mt-4 rounded-[18px] border border-[rgb(var(--border)/0.68)] bg-white/70 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
                  Note
                </p>
                <p className="mt-1 text-sm text-[rgb(var(--ink))]">{order.note}</p>
              </div>
            ) : null}

            <div className="mt-4 rounded-[18px] bg-[rgb(var(--card-surface-muted)/0.72)] p-3">
              <div className="flex items-center justify-between text-sm text-[rgb(var(--muted))]">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal, orderCurrency)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-[rgb(var(--muted))]">
                <span>Delivery fee</span>
                <span>{formatCurrency(order.deliveryFee, orderCurrency)}</span>
              </div>
              {order.deliverySavings ? (
                <div className="mt-2 flex items-center justify-between text-sm text-[rgb(var(--brand))]">
                  <span>Delivery savings</span>
                  <span>-{formatCurrency(order.deliverySavings, orderCurrency)}</span>
                </div>
              ) : null}
              <div className="mt-3 flex items-center justify-between border-t border-[rgb(var(--border)/0.72)] pt-3 text-sm font-semibold text-[rgb(var(--ink))]">
                <span>Total</span>
                <span>{formatCurrency(order.total, orderCurrency)}</span>
              </div>
            </div>
          </Surface>
        </div>
      </Container>
    </section>
  );
}
