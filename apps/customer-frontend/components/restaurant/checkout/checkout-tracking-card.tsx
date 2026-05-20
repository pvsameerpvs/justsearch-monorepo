import Link from 'next/link';
import { ChevronRight, PackageCheck } from 'lucide-react';
import { RestaurantDeliveryStatusBadge } from '../restaurant-delivery-status-badge';
import type { ActiveListOrder } from './use-active-order-list';

function formatOrderTime(value: string | number) {
  const d = typeof value === 'string' ? new Date(value) : new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

type CheckoutTrackingCardProps = {
  orders: ActiveListOrder[];
};

export function CheckoutTrackingCard({ orders }: CheckoutTrackingCardProps) {
  return (
    <div className="rounded-[28px] border border-[rgb(var(--border)/0.8)] bg-white px-5 py-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-3">
        <PackageCheck className="h-5 w-5 text-[rgb(var(--brand))]" />
        <div>
          <p className="text-xl font-bold text-[rgb(var(--ink))]">Order tracking</p>
          <p className="text-sm text-[rgb(var(--muted))]">Tap any order to open its live status.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-[rgb(var(--muted))]">Place the order to start tracking.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/menu/checkout/status/${encodeURIComponent(order.id)}`}
              className="block rounded-[18px] border border-[rgb(var(--border)/0.7)] bg-[rgb(var(--card-surface-muted)/0.45)] p-4 transition-colors hover:bg-[rgb(var(--card-surface-muted)/0.7)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[rgb(var(--ink))]">Order #{order.code || order.id.slice(0, 8)}</p>
                  <p className="mt-1 text-xs text-[rgb(var(--muted))]">{formatOrderTime(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <RestaurantDeliveryStatusBadge status={order.status as import('@justsearch/types').OrderStatus | 'order_confirmed' | 'assigned_delivery_boy' | 'delivered'} />
                  <ChevronRight className="h-4 w-4 text-[rgb(var(--muted))]" />
                </div>
              </div>
              {order.address && (
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[rgb(var(--muted))]">{order.address}</p>
              )}
              {order.restaurantName && !order.address && (
                <p className="mt-3 text-sm text-[rgb(var(--muted))]">{order.restaurantName}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
