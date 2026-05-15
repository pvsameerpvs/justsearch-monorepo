import Link from 'next/link';
import type { Restaurant } from '@/lib/restaurant-types';
import { getCheckoutLiveStages, getCheckoutStageIndex } from './checkout-live-status-utils';
import { STATUS_LABELS, STATUS_DESCRIPTIONS } from './checkout-status-constants';
import { CheckoutOrderTimeline } from './checkout-order-timeline';

interface OrderPresenterProps {
  order: {
    id: string;
    code: string;
    status: string;
    total: string;
    paymentMethod: string | null;
  };
  restaurant: Restaurant;
}

export function CheckoutLiveOrderStatusPresenter({ order }: OrderPresenterProps) {
  const stageIndex = getCheckoutStageIndex(order.status);
  const liveStages = getCheckoutLiveStages('Driver');
  const isDelivered = order.status === 'completed';
  const headline = STATUS_LABELS[order.status] || 'Order update';
  const supportText = STATUS_DESCRIPTIONS[order.status] || 'Your order is being processed.';

  return (
    <section className="py-4 sm:py-6">
      <div className="mx-auto max-w-2xl space-y-3">
        <StatusCard code={order.code} headline={headline} supportText={supportText} />
        <CheckoutOrderTimeline stages={liveStages} stageIndex={stageIndex} />
        <TotalCard total={order.total} paymentMethod={order.paymentMethod} />
        {isDelivered && <OrderAgainButton />}
      </div>
    </section>
  );
}

function StatusCard({ code, headline, supportText }: { code: string; headline: string; supportText: string }) {
  return (
    <div className="rounded-[24px] border border-[rgb(var(--border)/0.56)] bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-[rgb(var(--ink))]">{headline}</p>
          <p className="mt-1 text-sm text-slate-500">{supportText}</p>
        </div>
        <span className="rounded-full bg-[rgb(var(--brand-soft))] px-3 py-1 text-xs font-bold text-[rgb(var(--brand))]">{code}</span>
      </div>
    </div>
  );
}

function TotalCard({ total, paymentMethod }: { total: string; paymentMethod: string | null }) {
  return (
    <div className="rounded-[24px] border border-[rgb(var(--border)/0.56)] bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Total</p>
          <p className="text-xl font-bold text-[rgb(var(--ink))]">AED {total}</p>
        </div>
        {paymentMethod && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {paymentMethod === 'cash' ? '💵 Cash' : '💳 Card'}
          </span>
        )}
      </div>
    </div>
  );
}

function OrderAgainButton() {
  return (
    <div className="text-center">
      <Link href="/menu" className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--brand))] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
        Order Again
      </Link>
    </div>
  );
}
