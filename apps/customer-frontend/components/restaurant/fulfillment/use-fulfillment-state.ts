"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { StoredState, FulfillmentMode } from './fulfillment.types';
import {
  getStorageKey,
  createDefaultState,
  parseStoredState,
  computeCartLines,
  computeCartCount,
  computeSubtotal,
  computeDeliveryFee,
  computeTotal,
  buildOrdersWithStatus,
} from './fulfillment.constants';
import { useCartActions } from './use-cart-actions';
import { usePlaceOrder } from './use-place-order';

export function useFulfillmentState(restaurantSlug: string) {
  const [state, setState] = useState<StoredState>(createDefaultState);
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!restaurantSlug) return;
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(getStorageKey(restaurantSlug)) : null;
    setState(parseStoredState(raw));
    setHydrated(true);
  }, [restaurantSlug]);

  useEffect(() => {
    if (!hydrated || !restaurantSlug) return;
    window.localStorage.setItem(getStorageKey(restaurantSlug), JSON.stringify(state));
  }, [hydrated, restaurantSlug, state]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  const cart = useMemo(() => computeCartLines(state.cart), [state.cart]);
  const cartCount = useMemo(() => computeCartCount(cart), [cart]);
  const subtotal = useMemo(() => computeSubtotal(cart), [cart]);
  const deliveryFee = useMemo(() => computeDeliveryFee(cartCount), [cartCount]);
  const total = useMemo(() => computeTotal(subtotal, deliveryFee, 0), [subtotal, deliveryFee]);
  const orders = useMemo(() => buildOrdersWithStatus(state.orders, now), [state.orders, now]);

  const setMode = useCallback((mode: FulfillmentMode) => setState((s) => ({ ...s, mode })), []);
  const cartActions = useCartActions(setState);
  const placeOrder = usePlaceOrder(setState, cart, cartCount, subtotal, deliveryFee);

  return {
    hydrated,
    mode: state.mode,
    setMode,
    cart,
    cartCount,
    subtotal,
    deliveryFee,
    deliverySavings: 0,
    total,
    orders,
    placeOrder,
    ...cartActions,
  };
}
