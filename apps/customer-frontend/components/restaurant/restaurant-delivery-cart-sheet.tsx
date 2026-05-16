"use client";

import { X, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { useCheckoutGate } from './use-checkout-gate';
import { RestaurantDeliveryCartItem, type CartItem } from './restaurant-delivery-cart-item';
import { RestaurantDeliveryCartSummary } from './restaurant-delivery-cart-summary';
import { RestaurantDeliveryCartEmpty } from './restaurant-delivery-cart-empty';

type RestaurantDeliveryCartSheetProps = {
  open: boolean; currency: string; cart: CartItem[]; total: number; savings: number;
  onClose: () => void; onClear: () => void; onUpdateQuantity: (itemId: string, quantity: number) => void;
};

export function RestaurantDeliveryCartSheet({
  open, currency, cart, total, savings, onClose, onClear, onUpdateQuantity,
}: RestaurantDeliveryCartSheetProps) {
  const { handleCheckout } = useCheckoutGate();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10001] bg-black/40 backdrop-blur-[2px]">
      <button type="button" aria-label="Close cart" className="absolute inset-0 h-full w-full cursor-default" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl px-3 pb-[calc(var(--restaurant-mobile-nav-height,0px)+12px)] sm:px-6">
        <div className="overflow-hidden rounded-[28px] border border-[rgb(var(--border)/0.9)] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="flex justify-center pt-4">
            <div className="w-fit rounded-full border border-[rgba(245,158,11,0.2)] bg-[rgba(254,249,195,0.95)] px-5 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-[rgb(120,53,15)]">
              {formatCurrency(savings, currency)} saved | Free delivery applied
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <button type="button" onClick={onClose} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgb(var(--border)/0.9)] bg-white text-[rgb(var(--ink))]" aria-label="Close"><X className="h-5 w-5" /></button>
            <div className="text-right">
              <p className="text-lg font-bold tracking-tight text-[rgb(var(--ink))]">Added items</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[rgb(var(--muted))]">{cart.length} item{cart.length === 1 ? '' : 's'}</p>
            </div>
            <button type="button" onClick={onClear} className="inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--muted))]"><Trash2 className="h-4 w-4" />Clear</button>
          </div>
          {cart.length === 0 ? (
            <RestaurantDeliveryCartEmpty />
          ) : (
            <>
              <div className="max-h-[55vh] space-y-4 overflow-y-auto px-5 pb-5">
                {cart.map((item) => (
                  <RestaurantDeliveryCartItem key={item.itemId} item={item} onUpdateQuantity={onUpdateQuantity} />
                ))}
              </div>
              <RestaurantDeliveryCartSummary total={total} currency={currency} onCheckout={handleCheckout} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
