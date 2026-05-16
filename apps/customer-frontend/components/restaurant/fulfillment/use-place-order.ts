"use client";

import { useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { useRegistration } from '@/components/auth/registration-context';
import type { StoredState } from './fulfillment.types';
import { computeTotal } from './fulfillment.constants';

export function usePlaceOrder(
  setState: React.Dispatch<React.SetStateAction<StoredState>>,
  cart: { itemId: string; name: string; price: number; quantity: number; currency: string; image?: string }[],
  cartCount: number,
  subtotal: number,
  deliveryFee: number
) {
  const { user } = useRegistration();

  return useCallback(
    async ({ address, note }: { address: string; note: string; promoCode?: string; promoDiscount?: number }) => {
      if (cartCount === 0) return null;
      const totalVal = computeTotal(subtotal, deliveryFee, 0);
      const res = await apiClient<{ order: { id: string; code: string } }>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerName: user?.name ?? 'Guest',
          customerPhone: user?.mobile ?? '',
          fulfillmentType: 'delivery',
          items: cart.map((item) => ({
            menuItemId: item.itemId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          deliveryFee,
          tax: 0,
          total: totalVal,
          deliveryAddress: address,
          notes: note,
        }),
      });
      setState((s) => ({ ...s, cart: [] }));
      return res.order.id;
    },
    [cart, cartCount, subtotal, deliveryFee, setState]
  );
}
