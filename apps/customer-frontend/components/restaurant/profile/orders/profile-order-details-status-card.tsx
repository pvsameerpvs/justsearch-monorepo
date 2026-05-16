import { RestaurantDeliveryStatusBadge } from '@/components/restaurant/restaurant-delivery-status-badge';
import { Surface } from '@/components/shared/surface';
import type { DeliveryOrder } from '../../use-restaurant-fulfillment';
import {
  formatOrderPlacedTime,
  getOrderSummaryHeadline,
  getOrderSummarySupportText,
} from './profile-order-utils';

type Props = {
  order: DeliveryOrder;
};

export function ProfileOrderDetailsStatusCard({ order }: Props) {
  return (
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
  );
}
