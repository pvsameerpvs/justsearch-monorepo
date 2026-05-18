"use client";

import { useCallback } from 'react';
import { createOrder } from '@/lib/api/orders.api';
import { ApiError } from '@/lib/api/client';
import { useRegistration } from '@/components/auth/registration-context';
import type { StoredState, StoredOrder } from './fulfillment.types';
import { computeTotal } from './fulfillment.constants';

export function usePlaceOrder(
  setState: React.Dispatch<React.SetStateAction<StoredState>>,
  cart: { itemId: string; name: string; price: number; quantity: number; currency: string; image?: string }[],
  cartCount: number,
  subtotal: number,
  deliveryFee: number,
) {
  const { user, clearUser } = useRegistration();

  return useCallback(
    async ({ address, note, promoCode, promoDiscount, paymentMethod }: { address: string; note: string; promoCode?: string; promoDiscount?: number; paymentMethod?: 'cash' | 'card' }) => {
      if (!user) throw new Error('Please sign in to place an order');
      if (cartCount === 0) return null;
      const totalVal = computeTotal(subtotal, deliveryFee, 0);
      let res;
      try {
        res = await createOrder({
          customerName: user.name,
          customerPhone: user.mobile,
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
          paymentMethod,
        });
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          clearUser();
        }
        throw e;
      }

      const newOrder: StoredOrder = {
        id: res.order.id,
        createdAt: Date.now(),
        items: cart.map((item) => ({
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          currency: item.currency,
          image: item.image,
        })),
        address,
        note,
        riderName: '',
        subtotal,
        deliveryFee,
        total: totalVal,
        promoCode,
        promoDiscount,
      };

      setState((s) => ({ ...s, cart: [], orders: [newOrder, ...s.orders] }));
      return res.order.id;
    },
    [cart, cartCount, subtotal, deliveryFee, setState, user],
  );
}
