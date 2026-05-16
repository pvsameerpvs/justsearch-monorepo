import { Receipt } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import { formatCurrency } from '@/lib/format';
import type { DeliveryOrder } from '../../use-restaurant-fulfillment';

type Props = {
  order: DeliveryOrder;
  currency: string;
};

export function ProfileOrderDetailsInvoice({ order, currency }: Props) {
  return (
    <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.96] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--brand-soft)/0.35)] text-[rgb(var(--brand))]">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Invoice</p>
            <p className="mt-1 text-sm font-semibold text-[rgb(var(--ink))]">Total</p>
          </div>
        </div>
        <p className="font-display text-xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">{formatCurrency(order.total, currency)}</p>
      </div>

      <div className="mt-4 divide-y divide-[rgb(var(--border)/0.72)]">
        {order.items.map((item) => (
          <div key={item.itemId} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0"><p className="text-sm font-semibold text-[rgb(var(--ink))]">{item.quantity} x {item.name}</p></div>
            <p className="shrink-0 text-sm font-semibold text-[rgb(var(--ink))]">{formatCurrency(item.price * item.quantity, item.currency)}</p>
          </div>
        ))}
      </div>

      {order.note ? (
        <div className="mt-4 rounded-[18px] border border-[rgb(var(--border)/0.68)] bg-white/70 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Note</p>
          <p className="mt-1 text-sm text-[rgb(var(--ink))]">{order.note}</p>
        </div>
      ) : null}

      <div className="mt-4 rounded-[18px] bg-[rgb(var(--card-surface-muted)/0.72)] p-3">
        <div className="flex items-center justify-between text-sm text-[rgb(var(--muted))]"><span>Subtotal</span><span>{formatCurrency(order.subtotal, currency)}</span></div>
        <div className="mt-2 flex items-center justify-between text-sm text-[rgb(var(--muted))]"><span>Delivery fee</span><span>{formatCurrency(order.deliveryFee, currency)}</span></div>
        {order.deliverySavings ? (
          <div className="mt-2 flex items-center justify-between text-sm text-[rgb(var(--brand))]"><span>Delivery savings</span><span>-{formatCurrency(order.deliverySavings, currency)}</span></div>
        ) : null}
        <div className="mt-3 flex items-center justify-between border-t border-[rgb(var(--border)/0.72)] pt-3 text-sm font-semibold text-[rgb(var(--ink))]"><span>Total</span><span>{formatCurrency(order.total, currency)}</span></div>
      </div>
    </Surface>
  );
}
