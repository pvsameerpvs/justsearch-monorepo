"use client";

import { PackageCheck } from 'lucide-react';
import { RestaurantDeliveryStatusBadge } from '../restaurant-delivery-status-badge';
import type { DeliveryOrder } from '../use-restaurant-fulfillment';

function formatOrderTime(value: number) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(value);
}

type CheckoutTrackingCardProps = {
  orders: DeliveryOrder[];
};

export function CheckoutTrackingCard({ orders }: CheckoutTrackingCardProps) {
  return (
    <div className="rounded-[28px] border border-[rgb(var(--border)/0.8)] bg-white px-5 py-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-3">
        <PackageCheck className="h-5 w-5 text-[rgb(var(--brand))]" />
        <div>
          <p className="text-xl font-bold text-[rgb(var(--ink))]">Order tracking</p>
          <p className="text-sm text-[rgb(var(--muted))]">
            Customer-visible statuses: order confirmed, assign delivery boy, delivered order.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-[rgb(var(--muted))]">
          Place the order to start tracking.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-[18px] border border-[rgb(var(--border)/0.7)] bg-[rgb(var(--card-surface-muted)/0.45)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[rgb(var(--ink))]">Order #{order.id}</p>
                  <p className="mt-1 text-xs text-[rgb(var(--muted))]">{formatOrderTime(order.createdAt)}</p>
                </div>
                <RestaurantDeliveryStatusBadge status={order.status} />
              </div>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">{order.address}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
