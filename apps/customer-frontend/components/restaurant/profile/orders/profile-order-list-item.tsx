import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { RestaurantLogoBadge } from '@/components/restaurant/restaurant-logo-badge';
import { formatCurrency } from '@/lib/format';
import type { Restaurant } from '@/lib/restaurant-types';
import {
  getOrderItemsPreview,
  getOrderListStatusLine,
} from './profile-order-utils';

type OrderListItemData = {
  id: string;
  code?: string;
  restaurantName?: string;
  status: string;
  total: number | string;
  createdAt: string | number;
  items?: Array<{ name: string; quantity: number; currency?: string }>;
};

type ProfileOrderListItemProps = {
  restaurant: Restaurant;
  order: OrderListItemData;
};

export function ProfileOrderListItem({
  restaurant,
  order,
}: ProfileOrderListItemProps) {
  const orderCurrency =
    order.items?.[0]?.currency ?? restaurant.menu[0]?.items[0]?.currency ?? 'AED';

  const totalNumber = typeof order.total === 'string' ? Number(order.total) : order.total;
  const isCancelled = order.status === 'cancelled';

  return (
    <div className={`flex items-center gap-3 rounded-[22px] border px-3 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)] ${isCancelled ? 'border-red-200 bg-red-50/60' : 'border-[rgb(var(--border)/0.72)] bg-white/[0.92]'}`}>
      <Link
        href="/menu"
        aria-label={`Open ${restaurant.name} menu`}
        className="shrink-0 rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <RestaurantLogoBadge
          restaurant={restaurant}
          size="sm"
          className="h-11"
        />
      </Link>

      <Link
        href={`/profile/orders/${encodeURIComponent(order.id)}`}
        className="flex min-w-0 flex-1 items-start justify-between gap-3 rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className={`truncate text-sm font-semibold ${isCancelled ? 'text-red-700' : 'text-[rgb(var(--ink))]'}`}>
              {order.restaurantName || restaurant.name}
            </p>
            <ChevronRight className="h-4 w-4 shrink-0 text-[rgb(var(--muted))]" />
          </div>
          <p className={`mt-1 text-[12px] font-medium ${isCancelled ? 'text-red-600' : 'text-[rgb(var(--muted))]'}`}>
            {getOrderListStatusLine(order)}
          </p>
          <p className={`mt-1 truncate text-[12px] ${isCancelled ? 'text-red-500' : 'text-[rgb(var(--muted))]'}`}>
            {order.items && order.items.length > 0
              ? getOrderItemsPreview(order as any)
              : `Order #${order.code}`}
          </p>
        </div>

        <p className={`shrink-0 pt-0.5 text-sm font-semibold ${isCancelled ? 'text-red-700' : 'text-[rgb(var(--ink))]'}`}>
          {formatCurrency(totalNumber, orderCurrency)}
        </p>
      </Link>
    </div>
  );
}
