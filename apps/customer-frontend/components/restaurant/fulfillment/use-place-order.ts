"use client";

import { useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { StoredState } from './fulfillment.types';
import { computeTotal } from './fulfillment.constants';

export function usePlaceOrder(
  setState: React.Dispatch<React.SetStateAction<StoredState>>,
  cart: { itemId: string; name: string; price: number; quantity: number; currency: string; image?: string }[],
  cartCount: number,
  subtotal: number,
  deliveryFee: number
) {
  return useCallback(
    async ({ address, note, promoCode, promoDiscount = 0 }: { address: string; note: string; promoCode?: string; promoDiscount?: number }) => {
      if (cartCount === 0) return null;
      const fee = deliveryFee;
      const totalVal = computeTotal(subtotal, fee, promoDiscount);
      try {
        const res = await apiClient<{ order: { id: string; code: string } }>('/orders', {
          method: 'POST',
          body: JSON.stringify({
            customerName: 'Guest',
            customerPhone: '+971500000000',
            fulfillmentType: 'delivery',
            items: cart.map((item) => ({
              menuItemId: item.itemId,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            subtotal,
            deliveryFee: fee,
            tax: 0,
            total: totalVal,
            deliveryAddress: address,
            notes: note,
          }),
        });
        setState((s) => ({ ...s, cart: [] }));
        return res.order.id;
      } catch {
        const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
        const newOrder = {
          id,
          createdAt: Date.now(),
          items: cart,
          address,
          note,
          riderName: 'Rider',
          subtotal,
          deliveryFee: fee,
          promoCode,
          promoDiscount,
          total: totalVal,
        };
        setState((s) => ({ ...s, cart: [], orders: [newOrder, ...s.orders].slice(0, 10) }));
        return id;
      }
    },
    [cart, cartCount, subtotal, deliveryFee, setState]
  );
}
