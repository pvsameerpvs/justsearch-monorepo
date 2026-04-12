"use client";

import {
  ORDER_STATUS_DELIVERED_MS,
  type DeliveryOrder,
  type DeliveryOrderStatus,
} from '../use-restaurant-fulfillment';

export type CheckoutLiveStage = {
  id: 'accepted' | 'ready' | 'assigned' | 'completed';
  label: string;
  description: string;
};

export const CHECKOUT_STAGE_READY_MS = 90 * 1000;
export const CHECKOUT_STAGE_ASSIGNED_MS = 3 * 60 * 1000;
export const CHECKOUT_STAGE_COMPLETED_MS = ORDER_STATUS_DELIVERED_MS;

export type CheckoutActiveOrderSummary = {
  id: string;
  progress: number;
  isOnTheWay: boolean;
};

export function getCheckoutStageIndex(
  createdAt: number,
  now: number,
  orderStatus?: DeliveryOrderStatus,
) {
  const elapsed = now - createdAt;

  if (orderStatus === 'delivered' || elapsed >= CHECKOUT_STAGE_COMPLETED_MS) {
    return 3;
  }

  if (elapsed >= CHECKOUT_STAGE_ASSIGNED_MS) {
    return 2;
  }

  if (elapsed >= CHECKOUT_STAGE_READY_MS) {
    return 1;
  }

  return 0;
}

export function getCheckoutLiveStages(riderName: string): CheckoutLiveStage[] {
  return [
    {
      id: 'accepted',
      label: 'Order accepted',
      description: 'The restaurant confirmed your order and started preparation.',
    },
    {
      id: 'ready',
      label: 'Order ready',
      description: 'Your food is packed and waiting for handover.',
    },
    {
      id: 'assigned',
      label: 'Delivery boy assigned',
      description: `${riderName} is assigned and heading to pick up your order.`,
    },
    {
      id: 'completed',
      label: 'Delivery completed',
      description: 'Your order was delivered successfully. Enjoy your meal.',
    },
  ];
}

export function getActiveCheckoutOrders(
  orders: DeliveryOrder[],
  now: number,
) {
  return orders
    .filter((order) => getCheckoutStageIndex(order.createdAt, now, order.status) < 3)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function getCheckoutOrderSummaries(
  orders: DeliveryOrder[],
  now: number,
): CheckoutActiveOrderSummary[] {
  return getActiveCheckoutOrders(orders, now).map((order) => ({
    id: order.id,
    progress: Math.min(1, (now - order.createdAt) / CHECKOUT_STAGE_COMPLETED_MS),
    isOnTheWay: !!order.riderName,
  }));
}

export function buildFallbackRiderPhone(orderId: string) {
  const digits = orderId.replace(/\D/g, '');
  const seeded = digits.slice(-7).padStart(7, '4');
  return `+971 5${seeded}`;
}

export function normalizeTelValue(phone: string) {
  return phone.replace(/[^\d+]/g, '');
}

export function formatOrderStageEta(createdAt: number) {
  const etaDate = new Date(createdAt + 28 * 60 * 1000);
  const hh = etaDate.getHours().toString().padStart(2, '0');
  const mm = etaDate.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

export function getCheckoutStatusHref(orderIds: string[]) {
  if (orderIds.length === 0) {
    return null;
  }

  if (orderIds.length > 1) {
    return '/menu/checkout/status';
  }

  return `/menu/checkout/status/${encodeURIComponent(orderIds[0])}`;
}
