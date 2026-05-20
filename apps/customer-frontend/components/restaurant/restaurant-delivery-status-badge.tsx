import { Bike, CheckCheck, ClipboardCheck, XCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { OrderStatus } from '@justsearch/types';

type RestaurantDeliveryStatusBadgeProps = {
  status: OrderStatus | 'order_confirmed' | 'assigned_delivery_boy' | 'delivered';
  className?: string;
};

const statusConfig: Record<
  string,
  {
    label: string;
    icon: typeof ClipboardCheck;
    className: string;
  }
> = {
  pending: {
    label: 'Order Placed',
    icon: ClipboardCheck,
    className: 'bg-[rgb(var(--brand-soft)/0.9)] text-[rgb(var(--brand))]',
  },
  confirmed: {
    label: 'Order Confirmed',
    icon: ClipboardCheck,
    className: 'bg-[rgb(var(--brand-soft)/0.9)] text-[rgb(var(--brand))]',
  },
  order_confirmed: {
    label: 'Order Confirmed',
    icon: ClipboardCheck,
    className: 'bg-[rgb(var(--brand-soft)/0.9)] text-[rgb(var(--brand))]',
  },
  preparing: {
    label: 'Preparing',
    icon: ClipboardCheck,
    className: 'bg-amber-50 text-amber-700',
  },
  ready: {
    label: 'Ready',
    icon: ClipboardCheck,
    className: 'bg-violet-50 text-violet-700',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    icon: Bike,
    className: 'bg-[rgba(249,115,22,0.14)] text-[rgb(194,65,12)]',
  },
  assigned_delivery_boy: {
    label: 'Assigned Delivery Boy',
    icon: Bike,
    className: 'bg-[rgba(249,115,22,0.14)] text-[rgb(194,65,12)]',
  },
  completed: {
    label: 'Delivered Order',
    icon: CheckCheck,
    className: 'bg-[rgba(16,185,129,0.14)] text-[rgb(5,150,105)]',
  },
  delivered: {
    label: 'Delivered Order',
    icon: CheckCheck,
    className: 'bg-[rgba(16,185,129,0.14)] text-[rgb(5,150,105)]',
  },
  cancelled: {
    label: 'Order Cancelled',
    icon: XCircle,
    className: 'bg-red-50 text-red-600',
  },
};

export function RestaurantDeliveryStatusBadge({
  status,
  className,
}: RestaurantDeliveryStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]',
        config.className,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
