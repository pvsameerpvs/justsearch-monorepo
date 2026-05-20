import Link from 'next/link';
import type { Order, OrderItem } from '@justsearch/types';
import type { Restaurant } from '@/lib/restaurant-types';
import { getCheckoutLiveStages } from './checkout-live-status-utils';
import { getCheckoutStageIndex } from './checkout-status-normalizer';
import { STATUS_LABELS, STATUS_DESCRIPTIONS } from './checkout-status-constants';
import { CheckoutOrderTimeline } from './checkout-order-timeline';
import { CheckoutOrderItemsCard } from './checkout-order-items-card';
import { CheckoutOrderBreakdownCard } from './checkout-order-breakdown-card';
import { CheckoutOrderMetaCard } from './checkout-order-meta-card';
import { CheckoutStatusCard } from './checkout-status-card';
import { CheckoutCancelReasonCard } from './checkout-cancel-reason-card';

interface OrderPresenterProps {
  order: Order;
  items: OrderItem[];
  restaurant: Restaurant;
}

export function CheckoutLiveOrderStatusPresenter({ order, items }: OrderPresenterProps) {
  const stageIndex = getCheckoutStageIndex(order.status);
  const liveStages = getCheckoutLiveStages();
  const isDelivered = order.status === 'completed';
  const isCancelled = order.status === 'cancelled';
  const headline = STATUS_LABELS[order.status] || 'Order update';
  const supportText = isCancelled && order.cancelReason
    ? `This order has been cancelled: ${order.cancelReason}`
    : (STATUS_DESCRIPTIONS[order.status] || 'Your order is being processed.');

  return (
    <section className="py-4 sm:py-6">
      <div className="mx-auto max-w-2xl space-y-3">
        <CheckoutStatusCard
          code={order.code}
          headline={headline}
          supportText={supportText}
          isCancelled={isCancelled}
        />
        {isCancelled && <CheckoutCancelReasonCard reason={order.cancelReason} />}
        {!isCancelled && <CheckoutOrderTimeline stages={liveStages} stageIndex={stageIndex} />}
        <CheckoutOrderItemsCard items={items} />
        <CheckoutOrderBreakdownCard
          subtotal={order.subtotal}
          deliveryFee={order.deliveryFee}
          tax={order.tax}
          total={order.total}
        />
        <CheckoutOrderMetaCard
          customerName={order.customerName}
          customerPhone={order.customerPhone}
          alternateNumber={order.alternateNumber}
          deliveryAddress={order.deliveryAddress}
          notes={order.notes}
          createdAt={order.createdAt}
        />
        {isDelivered && (
          <div className="text-center">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--brand))] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Order Again
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
