import type { StoredState, DeliveryOrderStatus, DeliveryOrder } from './fulfillment.types';

export const STORAGE_PREFIX = 'justsearch:restaurant:fulfillment';
export const DELIVERY_BASE_FEE = 7;
export const ORDER_STATUS_ASSIGNED_DELIVERY_BOY_MS = 2 * 60 * 1000;
export const ORDER_STATUS_DELIVERED_MS = 6 * 60 * 1000;

export function getStorageKey(restaurantSlug: string) {
  return `${STORAGE_PREFIX}:${restaurantSlug}`;
}

export function createDefaultState(): StoredState {
  return { mode: 'delivery', cart: [], orders: [] };
}

export function parseStoredState(raw: string | null): StoredState {
  if (!raw) return createDefaultState();
  try {
    const parsed = JSON.parse(raw);
    return {
      mode: parsed.mode === 'dine-in' ? 'delivery' : (parsed.mode || 'delivery'),
      cart: parsed.cart || [],
      orders: parsed.orders || [],
    };
  } catch {
    return createDefaultState();
  }
}

export function computeCartLines(cart: StoredState['cart']) {
  return cart.map((item) => ({ ...item, lineTotal: item.price * item.quantity }));
}

export function computeCartCount(lines: { quantity: number }[]) {
  return lines.reduce((total, item) => total + item.quantity, 0);
}

export function computeSubtotal(lines: { lineTotal: number }[]) {
  return lines.reduce((total, item) => total + item.lineTotal, 0);
}

export function computeDeliveryFee(cartCount: number) {
  return cartCount > 0 ? DELIVERY_BASE_FEE : 0;
}

export function computeTotal(subtotal: number, fee: number, discount: number) {
  return Math.max(0, subtotal + fee - discount);
}

export function buildOrdersWithStatus(
  orders: StoredState['orders'],
  now: number
): DeliveryOrder[] {
  return orders
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((order) => {
      const elapsed = now - order.createdAt;
      let status: DeliveryOrderStatus = 'order_confirmed';
      if (elapsed >= ORDER_STATUS_DELIVERED_MS) status = 'delivered';
      else if (elapsed >= ORDER_STATUS_ASSIGNED_DELIVERY_BOY_MS) status = 'assigned_delivery_boy';
      return { ...order, status };
    });
}
