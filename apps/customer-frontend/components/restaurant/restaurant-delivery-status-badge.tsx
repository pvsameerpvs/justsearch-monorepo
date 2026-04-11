import { Bike, CheckCheck, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { DeliveryOrderStatus } from './use-restaurant-fulfillment';

type RestaurantDeliveryStatusBadgeProps = {
  status: DeliveryOrderStatus;
  className?: string;
};

const statusConfig: Record<
  DeliveryOrderStatus,
  {
    label: string;
    icon: typeof ClipboardCheck;
    className: string;
  }
> = {
  order_confirmed: {
    label: 'Order Confirmed',
    icon: ClipboardCheck,
    className: 'bg-[rgb(var(--brand-soft)/0.9)] text-[rgb(var(--brand))]',
  },
  assigned_delivery_boy: {
    label: 'Assigned Delivery Boy',
    icon: Bike,
    className: 'bg-[rgba(249,115,22,0.14)] text-[rgb(194,65,12)]',
  },
  delivered: {
    label: 'Delivered Order',
    icon: CheckCheck,
    className: 'bg-[rgba(16,185,129,0.14)] text-[rgb(5,150,105)]',
  },
};

export function RestaurantDeliveryStatusBadge({
  status,
  className,
}: RestaurantDeliveryStatusBadgeProps) {
  const config = statusConfig[status];
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

