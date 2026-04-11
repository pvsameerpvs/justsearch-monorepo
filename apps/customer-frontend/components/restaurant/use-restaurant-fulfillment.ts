"use client";

import { useEffect, useMemo, useState } from 'react';
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
const STATUS_CONFIRMED_MS = 2 * 60 * 1000;
const STATUS_ASSIGNED_MS = 6 * 60 * 1000;
const DEFAULT_RIDER_NAME = 'Delivery Rider';

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

function isStoredCartItem(value: unknown): value is StoredCartItem {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<StoredCartItem>;
  return (
    typeof candidate.itemId === 'string' &&
    typeof candidate.quantity === 'number' &&
    typeof candidate.name === 'string' &&
    typeof candidate.price === 'number' &&
    typeof candidate.currency === 'string'
  );
}

function isStoredOrder(value: unknown): value is StoredOrder {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<StoredOrder>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.createdAt === 'number' &&
    Array.isArray(candidate.items) &&
    candidate.items.every(isStoredCartItem) &&
    typeof candidate.address === 'string' &&
    typeof candidate.note === 'string' &&
    typeof candidate.riderName === 'string' &&
    typeof candidate.subtotal === 'number' &&
    typeof candidate.deliveryFee === 'number' &&
    (typeof candidate.deliverySavings === 'undefined' ||
      typeof candidate.deliverySavings === 'number') &&
    typeof candidate.total === 'number'
  );
}

function parseStoredState(raw: string | null): StoredState {
  if (!raw) return createDefaultState();

  try {
    const parsed = JSON.parse(raw) as Partial<StoredState>;

    if (
      (parsed.mode === 'dine-in' || parsed.mode === 'delivery') &&
      Array.isArray(parsed.cart) &&
      parsed.cart.every(isStoredCartItem) &&
      Array.isArray(parsed.orders) &&
      parsed.orders.every(isStoredOrder)
    ) {
      return {
        mode: parsed.mode,
        cart: parsed.cart,
        orders: parsed.orders.map((order) => ({
          ...order,
          deliverySavings: order.deliverySavings ?? DELIVERY_BASE_FEE,
        })),
      };
    }
  } catch {
    return createDefaultState();
  }

  return createDefaultState();
}

function readState(restaurantSlug: string): StoredState {
  if (typeof window === 'undefined') return createDefaultState();

  try {
    return parseStoredState(window.localStorage.getItem(getStorageKey(restaurantSlug)));
  } catch {
    return createDefaultState();
  }
}

function writeState(restaurantSlug: string, state: StoredState) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(getStorageKey(restaurantSlug), JSON.stringify(state));
  } catch {
    // ignore localStorage write errors in demo mode
  }
}

function buildRiderName(restaurantName: string) {
  const shortName = restaurantName.split(' ').slice(0, 2).join(' ').trim();
  return shortName ? `${shortName} Rider` : DEFAULT_RIDER_NAME;
}

function buildOrderStatus(createdAt: number, now: number): DeliveryOrderStatus {
  const elapsed = now - createdAt;

  if (elapsed >= STATUS_ASSIGNED_MS) {
    return 'delivered';
  }

  if (elapsed >= STATUS_CONFIRMED_MS) {
    return 'assigned_delivery_boy';
  }

  return 'order_confirmed';
}

function buildOrderId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().slice(0, 8).toUpperCase();
  }

  return `ORD-${Date.now().toString(36).toUpperCase()}`;
}

function snapshotMenuItem(item: MenuItem): StoredCartItem {
  return {
    itemId: item.id,
    quantity: 1,
    name: item.name,
    price: item.price,
    currency: item.currency,
    image: item.image,
  };
}

export function useRestaurantFulfillment(restaurant: Restaurant) {
  const [state, setState] = useState<StoredState>(createDefaultState());
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const stored = readState(restaurant.slug);
    setState(stored);
    setHydrated(true);
  }, [restaurant.slug]);

  useEffect(() => {
    if (!hydrated) return;
    writeState(restaurant.slug, state);
  }, [hydrated, restaurant.slug, state]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const onStorage = (event: StorageEvent) => {
      if (event.key !== getStorageKey(restaurant.slug)) return;
      setState(readState(restaurant.slug));
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [restaurant.slug]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 30000);

    return () => window.clearInterval(timer);
  }, []);

  const cart = useMemo<DeliveryCartLine[]>(
    () =>
      state.cart.map((item) => ({
        ...item,
        lineTotal: item.price * item.quantity,
      })),
    [state.cart],
  );

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart],
  );

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.lineTotal, 0),
    [cart],
  );

  const deliveryFee = 0;
  const deliverySavings = state.mode === 'delivery' && cartCount > 0 ? DELIVERY_BASE_FEE : 0;
  const total = subtotal + deliveryFee;

  const orders = useMemo<DeliveryOrder[]>(
    () =>
      [...state.orders]
        .sort((left, right) => right.createdAt - left.createdAt)
        .map((order) => ({
          ...order,
          status: buildOrderStatus(order.createdAt, now),
        })),
    [now, state.orders],
  );

  const setMode = (mode: FulfillmentMode) => {
    setState((current) => ({
      ...current,
      mode,
    }));
  };

  const getQuantity = (itemId: string) =>
    state.cart.find((item) => item.itemId === itemId)?.quantity ?? 0;

  const addToCart = (item: MenuItem) => {
    if (!item.isAvailable) return;

    setState((current) => {
      const existingItem = current.cart.find((cartItem) => cartItem.itemId === item.id);

      if (existingItem) {
        return {
          ...current,
          cart: current.cart.map((cartItem) =>
            cartItem.itemId === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem,
          ),
        };
      }

      return {
        ...current,
        cart: [...current.cart, snapshotMenuItem(item)],
      };
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    const normalizedQuantity = Math.max(0, Math.floor(quantity));

    setState((current) => ({
      ...current,
      cart:
        normalizedQuantity === 0
          ? current.cart.filter((item) => item.itemId !== itemId)
          : current.cart.map((item) =>
              item.itemId === itemId ? { ...item, quantity: normalizedQuantity } : item,
            ),
    }));
  };

  const clearCart = () => {
    setState((current) => ({
      ...current,
      cart: [],
    }));
  };

  const placeOrder = ({
    address,
    note,
  }: {
    address: string;
    note: string;
  }) => {
    const trimmedAddress = address.trim();
    const trimmedNote = note.trim();

    if (!trimmedAddress || state.cart.length === 0) {
      return null;
    }

    const orderId = buildOrderId();
    const nextOrder: StoredOrder = {
      id: orderId,
      createdAt: Date.now(),
      items: state.cart,
      address: trimmedAddress,
      note: trimmedNote,
      riderName: buildRiderName(restaurant.name),
      subtotal,
      deliveryFee: 0,
      deliverySavings: DELIVERY_BASE_FEE,
      total: subtotal,
    };

    setState((current) => ({
      ...current,
      mode: 'delivery',
      cart: [],
      orders: [nextOrder, ...current.orders].slice(0, 12),
    }));

    return orderId;
  };

  return {
    mode: state.mode,
    setMode,
    cart,
    cartCount,
    subtotal,
    deliveryFee,
    deliverySavings,
    total,
    orders,
    getQuantity,
    addToCart,
    updateQuantity,
    clearCart,
    placeOrder,
  };
}
