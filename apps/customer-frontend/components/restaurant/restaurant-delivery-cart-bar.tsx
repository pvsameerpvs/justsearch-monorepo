"use client";

import { ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { useCheckoutGate } from './use-checkout-gate';

type RestaurantDeliveryCartBarProps = {
  currency: string;
  cartCount: number;
  total: number;
  savings: number;
  onOpenCart: () => void;
};

export function RestaurantDeliveryCartBar({
  currency,
  cartCount,
  total,
  savings,
  onOpenCart,
}: RestaurantDeliveryCartBarProps) {
  const { handleCheckout } = useCheckoutGate();
  return (
    <div className="fixed inset-x-0 z-[9998] px-3 sm:px-6" style={{ bottom: 'calc(var(--restaurant-mobile-nav-height,0px) + 12px)' }}>
      <div className="mx-auto w-full max-w-3xl">
        {savings > 0 ? (
          <div className="mx-auto w-fit rounded-t-2xl border border-b-0 border-[rgba(245,158,11,0.22)] bg-[rgba(254,249,195,0.96)] px-6 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-[rgb(120,53,15)] shadow-[0_-8px_20px_rgba(245,158,11,0.06)]">
            {formatCurrency(savings, currency)} saved | Free delivery applied
          </div>
        ) : null}

        <div
          role="button"
          tabIndex={0}
          onClick={onOpenCart}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onOpenCart();
            }
          }}
          className="flex cursor-pointer items-center justify-between gap-3 rounded-[22px] border border-[rgb(var(--border)/0.9)] bg-white px-4 py-3 shadow-[0_18px_48px_rgba(15,23,42,0.14)]"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(var(--brand-soft)/0.65)] text-[rgb(var(--brand))]">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[rgb(var(--brand))] px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold tracking-tight text-[rgb(var(--ink))]">
                {formatCurrency(total, currency)}
              </p>
              <p className="truncate text-sm text-[rgb(var(--muted))]">
                Tap to review cart items
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCheckout();
            }}
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-[18px] bg-[rgb(var(--brand))] px-6 text-base font-bold text-white shadow-[0_10px_28px_rgb(var(--brand)/0.25)] transition-all hover:brightness-105 active:scale-95"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

