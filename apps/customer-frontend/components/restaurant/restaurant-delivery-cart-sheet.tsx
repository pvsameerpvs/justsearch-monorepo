"use client";

import { Trash2, X } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { useCheckoutGate } from './use-checkout-gate';

type CartItem = {
  itemId: string;
  quantity: number;
  name: string;
  price: number;
  currency: string;
  image?: string;
  lineTotal: number;
};

type RestaurantDeliveryCartSheetProps = {
  open: boolean;
  currency: string;
  cart: CartItem[];
  total: number;
  savings: number;
  onClose: () => void;
  onClear: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
};

export function RestaurantDeliveryCartSheet({
  open,
  currency,
  cart,
  total,
  savings,
  onClose,
  onClear,
  onUpdateQuantity,
}: RestaurantDeliveryCartSheetProps) {
  const { handleCheckout } = useCheckoutGate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10001] bg-black/40 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl px-3 pb-[calc(var(--restaurant-mobile-nav-height,0px)+12px)] sm:px-6">
        <div className="overflow-hidden rounded-[28px] border border-[rgb(var(--border)/0.9)] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="flex justify-center pt-4">
            <div className="w-fit rounded-full border border-[rgba(245,158,11,0.2)] bg-[rgba(254,249,195,0.95)] px-5 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-[rgb(120,53,15)]">
              {formatCurrency(savings, currency)} saved | Free delivery applied
            </div>
          </div>

          <div className="flex items-center justify-between px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgb(var(--border)/0.9)] bg-white text-[rgb(var(--ink))]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-right">
              <p className="text-lg font-bold tracking-tight text-[rgb(var(--ink))]">Added items</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
                {cart.length} item{cart.length === 1 ? '' : 's'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--muted))]"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          </div>

          <div className="max-h-[55vh] space-y-4 overflow-y-auto px-5 pb-5">
            {cart.map((item) => (
              <article key={item.itemId} className="border-b border-[rgb(var(--border)/0.6)] pb-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xl font-bold leading-tight text-[rgb(var(--ink))]">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-[rgb(var(--muted))]">One portion</p>
                    <p className="mt-3 text-2xl font-bold tracking-tight text-[rgb(var(--brand))]">
                      {formatCurrency(item.price, item.currency)}
                    </p>
                  </div>

                  <div className="w-[92px] shrink-0">
                    <div className="overflow-hidden rounded-[18px] border border-[rgb(var(--border)/0.75)] bg-[rgb(var(--card-surface-muted)/0.8)]">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-[84px] w-full object-cover" />
                      ) : (
                        <div className="flex h-[84px] items-center justify-center text-sm text-[rgb(var(--muted))]">
                          Item
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <div className="inline-flex items-center rounded-full bg-[rgb(var(--card-surface-muted)/0.9)] p-1">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.itemId, item.quantity - 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-semibold text-[rgb(var(--ink))]"
                    >
                      -
                    </button>
                    <span className="min-w-[2.5rem] text-center text-lg font-bold text-[rgb(var(--ink))]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.itemId, item.quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-semibold text-[rgb(var(--ink))]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[rgb(var(--border)/0.7)] px-5 py-4">
            <div className="min-w-0">
              <p className="text-2xl font-bold tracking-tight text-[rgb(var(--ink))]">
                {formatCurrency(total, currency)}
              </p>
              <p className="text-sm text-[rgb(var(--muted))]">Free delivery</p>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-[18px] bg-[rgb(var(--brand))] px-7 text-base font-bold text-white shadow-[0_10px_28px_rgb(var(--brand)/0.25)] transition-all hover:brightness-105 active:scale-95"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

