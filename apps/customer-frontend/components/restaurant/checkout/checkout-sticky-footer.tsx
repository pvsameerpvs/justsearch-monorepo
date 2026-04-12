"use client";

import { formatCurrency } from '@/lib/format';

type CheckoutStickyFooterProps = {
  total: number;
  currency: string;
  error: string | null;
  latestOrderId: string | null;
  cartCount: number;
  isPlacing?: boolean;
  onPlaceOrder: () => void;
};

export function CheckoutStickyFooter({
  total,
  currency,
  error,
  latestOrderId,
  cartCount,
  isPlacing = false,
  onPlaceOrder,
}: CheckoutStickyFooterProps) {
  return (
    <div className="fixed inset-x-0 z-[9998] px-3 sm:px-6" style={{ bottom: 'calc(var(--restaurant-mobile-nav-height,0px) + 12px)' }}>
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 rounded-[26px] border border-[rgb(var(--border)/0.85)] bg-white px-6 py-5 shadow-[0_24px_64px_-12px_rgba(15,23,42,0.18)]">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-widest text-[rgb(var(--muted))]">Total</p>
          <p className="text-2xl font-black tracking-tight text-[rgb(var(--ink))]">
            {formatCurrency(total, currency)}
          </p>
          {error ? <p className="mt-1 text-[10px] font-bold text-red-600">{error}</p> : null}
          {latestOrderId ? (
            <p className="mt-1 text-[10px] font-bold text-emerald-600">
              Order #{latestOrderId} placed!
            </p>
          ) : null}
        </div>
        
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={cartCount === 0 || isPlacing}
          className="inline-flex h-14 shrink-0 items-center justify-center rounded-[20px] bg-[rgb(var(--brand))] px-8 text-lg font-bold text-white shadow-[0_12px_36px_rgb(var(--brand)/0.25)] transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPlacing ? 'Placing...' : cartCount > 0 ? 'Place Order' : 'Order Placed'}
        </button>
      </div>
    </div>
  );
}
