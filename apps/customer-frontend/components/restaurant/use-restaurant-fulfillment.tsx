"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { MenuItem, Restaurant } from '@/lib/restaurant-types';

export type FulfillmentMode = 'dine-in' | 'delivery';
export type DeliveryOrderStatus = 'order_confirmed' | 'assigned_delivery_boy' | 'delivered';

type StoredCartItem = {
  itemId: string;
  quantity: number;
  name: string;
  price: number;
  currency: string;
  image?: string;
};

type StoredOrder = {
  id: string;
  createdAt: number;
  items: StoredCartItem[];
  address: string;
  note: string;
  riderName: string;
  riderPhone?: string;
  subtotal: number;
  deliveryFee: number;
  deliverySavings?: number;
  total: number;
};

type StoredState = {
  mode: FulfillmentMode;
  cart: StoredCartItem[];
  orders: StoredOrder[];
};

export type DeliveryCartLine = StoredCartItem & {
  lineTotal: number;
};

export type DeliveryOrder = StoredOrder & {
  status: DeliveryOrderStatus;
};

const STORAGE_PREFIX = 'justsearch:restaurant:fulfillment';
const DELIVERY_BASE_FEE = 7;
export const ORDER_STATUS_ASSIGNED_DELIVERY_BOY_MS = 2 * 60 * 1000;
export const ORDER_STATUS_DELIVERED_MS = 6 * 60 * 1000;

function getStorageKey(restaurantSlug: string) {
  return `${STORAGE_PREFIX}:${restaurantSlug}`;
}

function createDefaultState(): StoredState {
  return {
    mode: 'dine-in',
    cart: [],
    orders: [],
  };
}

function parseStoredState(raw: string | null): StoredState {
  if (!raw) return createDefaultState();
  try {
    const parsed = JSON.parse(raw);
    return {
      mode: parsed.mode || 'dine-in',
      cart: parsed.cart || [],
      orders: parsed.orders || [],
    };
  } catch {
    return createDefaultState();
  }
}

// CONTEXT DEFINITION
type FulfillmentContextType = {
  hydrated: boolean;
  mode: FulfillmentMode;
  setMode: (mode: FulfillmentMode) => void;
  cart: DeliveryCartLine[];
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  deliverySavings: number;
  total: number;
  orders: DeliveryOrder[];
  getQuantity: (itemId: string) => number;
  addToCart: (item: MenuItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (data: { address: string; note: string }) => string | null;
};

const FulfillmentContext = createContext<FulfillmentContextType | null>(null);

export function FulfillmentProvider({ 
  restaurant, 
  children 
}: { 
  restaurant: Restaurant; 
  children: React.ReactNode 
}) {
  const [state, setState] = useState<StoredState>(createDefaultState());
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!restaurant?.slug) return;
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(getStorageKey(restaurant.slug)) : null;
    setState(parseStoredState(raw));
    setHydrated(true);
  }, [restaurant?.slug]);

  useEffect(() => {
    if (!hydrated || !restaurant?.slug) return;
    window.localStorage.setItem(getStorageKey(restaurant.slug), JSON.stringify(state));
  }, [hydrated, restaurant?.slug, state]);

  // Sync clock for status updates
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  const cart = useMemo(() => state.cart.map(item => ({ ...item, lineTotal: item.price * item.quantity })), [state.cart]);
  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((total, item) => total + item.lineTotal, 0), [cart]);
  const orders = useMemo(() => {
    return state.orders
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(order => {
        const elapsed = now - order.createdAt;
        let status: DeliveryOrderStatus = 'order_confirmed';
        if (elapsed >= ORDER_STATUS_DELIVERED_MS) status = 'delivered';
        else if (elapsed >= ORDER_STATUS_ASSIGNED_DELIVERY_BOY_MS) status = 'assigned_delivery_boy';
        return { ...order, status };
      });
  }, [state.orders, now]);

  const value: FulfillmentContextType = {
    hydrated,
    mode: state.mode,
    setMode: (mode) => setState(s => ({ ...s, mode })),
    cart,
    cartCount,
    subtotal,
    deliveryFee: 0,
    deliverySavings: state.mode === 'delivery' && cartCount > 0 ? DELIVERY_BASE_FEE : 0,
    total: subtotal,
    orders,
    getQuantity: (id) => state.cart.find(i => i.itemId === id)?.quantity ?? 0,
    addToCart: (item) => {
        setState(current => {
            const existing = current.cart.find(i => i.itemId === item.id);
            if (existing) {
                return { ...current, cart: current.cart.map(i => i.itemId === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
            }
            return { ...current, cart: [...current.cart, { itemId: item.id, quantity: 1, name: item.name, price: item.price, currency: item.currency, image: item.image }] };
        });
    },
    updateQuantity: (id, q) => setState(s => ({ ...s, cart: q <= 0 ? s.cart.filter(i => i.itemId !== id) : s.cart.map(i => i.itemId === id ? { ...i, quantity: q } : i) })),
    clearCart: () => setState(s => ({ ...s, cart: [] })),
    placeOrder: ({ address, note }) => {
        const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
        const newOrder: StoredOrder = {
            id,
            createdAt: Date.now(),
            items: state.cart,
            address,
            note,
            riderName: `${restaurant.name} Rider`,
            subtotal,
            deliveryFee: 0,
            total: subtotal,
        };
        setState(s => ({ ...s, cart: [], orders: [newOrder, ...s.orders].slice(0, 10) }));
        return id;
    }
  };

  return <FulfillmentContext.Provider value={value}>{children}</FulfillmentContext.Provider>;
}

export function useRestaurantFulfillment() {
  const context = useContext(FulfillmentContext);
  if (!context) throw new Error("useRestaurantFulfillment must be used within a FulfillmentProvider");
  return context;
}
