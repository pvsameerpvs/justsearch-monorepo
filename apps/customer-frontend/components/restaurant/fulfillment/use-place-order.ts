"use client";

import { useCallback } from 'react';
import { createOrder } from '@/lib/api/orders.api';
import { ensureFreshToken } from '@/lib/auth/auth-client';
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
  const { user } = useRegistration();

  return useCallback(
    async ({ address, note, promoCode, promoDiscount, paymentMethod, alternateNumber, lat, lng, deliveryFee: dynamicFee }: { address: string; note: string; promoCode?: string; promoDiscount?: number; paymentMethod?: 'cash' | 'card'; alternateNumber?: string; lat?: number; lng?: number; deliveryFee?: number }) => {
      if (!user) throw new Error('Please sign in to place an order');
      if (cartCount === 0) return null;

      // Proactively refresh token before it expires mid-order
      const tokenFresh = await ensureFreshToken(3);
      if (!tokenFresh) {
        throw new Error('Session expired. Please sign in again.');
      }

      const fee = dynamicFee ?? deliveryFee;
      const totalVal = computeTotal(subtotal, fee, 0);
      const res = await createOrder({
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
        deliveryFee: fee,
        tax: 0,
        total: totalVal,
        deliveryAddress: address,
        notes: note,
        paymentMethod,
        alternateNumber,
        lat,
        lng,
      });

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
        deliveryFee: fee,
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
