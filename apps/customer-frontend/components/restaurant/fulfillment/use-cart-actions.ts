"use client";

import { useCallback, useRef } from 'react';
import type { StoredState } from './fulfillment.types';

export function useCartActions(setState: React.Dispatch<React.SetStateAction<StoredState>>) {
  const stateRef = useRef<StoredState | null>(null);

  const setStateWithRef: React.Dispatch<React.SetStateAction<StoredState>> = useCallback(
    (action) => {
      setState((prev) => {
        const next = typeof action === 'function' ? action(prev) : action;
        stateRef.current = next;
        return next;
      });
    },
    [setState],
  );

  const getQuantity = useCallback(
    (id: string) => {
      const current = stateRef.current;
      return current?.cart.find((i) => i.itemId === id)?.quantity ?? 0;
    },
    [],
  );

  const addToCart = useCallback((item: { id: string; name: string; price: number; currency: string; image?: string }) => {
    setStateWithRef((current) => {
      const existing = current.cart.find((i) => i.itemId === item.id);
      if (existing) {
        return {
          ...current,
          cart: current.cart.map((i) => (i.itemId === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
        };
      }
      return {
        ...current,
        cart: [...current.cart, { itemId: item.id, quantity: 1, name: item.name, price: item.price, currency: item.currency, image: item.image }],
      };
    });
  }, [setStateWithRef]);

  const updateQuantity = useCallback((id: string, q: number) => {
    setStateWithRef((s) => ({
      ...s,
      cart: q <= 0 ? s.cart.filter((i) => i.itemId !== id) : s.cart.map((i) => (i.itemId === id ? { ...i, quantity: q } : i)),
    }));
  }, [setStateWithRef]);

  const clearCart = useCallback(() => setStateWithRef((s) => ({ ...s, cart: [] })), [setStateWithRef]);

  return { getQuantity, addToCart, updateQuantity, clearCart };
}
