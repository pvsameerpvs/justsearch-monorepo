"use client";

import { useCallback } from 'react';
import type { StoredState } from './fulfillment.types';

export function useCartActions(setState: React.Dispatch<React.SetStateAction<StoredState>>) {
  const getQuantity = useCallback(
    (id: string) => {
      let qty = 0;
      setState((s) => { qty = s.cart.find((i) => i.itemId === id)?.quantity ?? 0; return s; });
      return qty;
    },
    [setState]
  );

  const addToCart = useCallback((item: { id: string; name: string; price: number; currency: string; image?: string }) => {
    setState((current) => {
      const existing = current.cart.find((i) => i.itemId === item.id);
      if (existing) {
        return {
          ...current,
          cart: current.cart.map((i) => (i.itemId === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
        };
      }
      return {
        ...current,
        cart: [
          ...current.cart,
          { itemId: item.id, quantity: 1, name: item.name, price: item.price, currency: item.currency, image: item.image },
        ],
      };
    });
  }, [setState]);

  const updateQuantity = useCallback((id: string, q: number) => {
    setState((s) => ({
      ...s,
      cart: q <= 0 ? s.cart.filter((i) => i.itemId !== id) : s.cart.map((i) => (i.itemId === id ? { ...i, quantity: q } : i)),
    }));
  }, [setState]);

  const clearCart = useCallback(() => setState((s) => ({ ...s, cart: [] })), [setState]);

  return { getQuantity, addToCart, updateQuantity, clearCart };
}
