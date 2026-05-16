import { formatCurrency } from '@/lib/format';

type Props = {
  total: number;
  currency: string;
  onCheckout: () => void;
};

export function RestaurantDeliveryCartSummary({ total, currency, onCheckout }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[rgb(var(--border)/0.7)] px-5 py-4">
      <div className="min-w-0">
        <p className="text-2xl font-bold tracking-tight text-[rgb(var(--ink))]">{formatCurrency(total, currency)}</p>
        <p className="text-sm text-[rgb(var(--muted))]">Free delivery</p>
      </div>
      <button
        type="button"
        onClick={onCheckout}
        className="inline-flex h-12 shrink-0 items-center justify-center rounded-[18px] bg-[rgb(var(--brand))] px-7 text-base font-bold text-white shadow-[0_10px_28px_rgb(var(--brand)/0.25)] transition-all hover:brightness-105 active:scale-95"
      >
        Checkout
      </button>
    </div>
  );
}
