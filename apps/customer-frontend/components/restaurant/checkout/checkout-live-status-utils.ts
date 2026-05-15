const LOCAL_TO_BACKEND: Record<string, string> = {
  order_confirmed: 'confirmed',
  assigned_delivery_boy: 'out_for_delivery',
  delivered: 'completed',
};

function normalizeStatus(status: string): string {
  return LOCAL_TO_BACKEND[status] || status;
}

export function getCheckoutStageIndex(status: string): number {
  const stageMap: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    preparing: 1,
    ready: 1,
    out_for_delivery: 2,
    completed: 3,
    cancelled: 0,
  };
  return stageMap[normalizeStatus(status)] ?? 0;
}

export type CheckoutLiveStage = {
  id: string;
  label: string;
  description: string;
};

export function getCheckoutLiveStages(riderName: string): CheckoutLiveStage[] {
  return [
    { id: 'accepted', label: 'Order accepted', description: 'The restaurant confirmed your order.' },
    { id: 'ready', label: 'Order ready', description: 'Your food is packed and waiting.' },
    { id: 'assigned', label: 'Delivery assigned', description: `${riderName} is heading to pick up your order.` },
    { id: 'completed', label: 'Delivery completed', description: 'Your order was delivered successfully.' },
  ];
}

export type CheckoutActiveOrderSummary = {
  id: string;
  progress: number;
  isOnTheWay: boolean;
};

export function getActiveCheckoutOrders<T extends { status: string }>(orders: T[], _now?: number): T[] {
  return orders.filter((order) => {
    const ns = normalizeStatus(order.status);
    return ns !== 'completed' && ns !== 'cancelled';
  });
}

const MS_2MIN = 2 * 60 * 1000;
const MS_6MIN = 6 * 60 * 1000;

function computeAnimatedProgress(status: string, createdAt: number, now: number): number {
  const ns = normalizeStatus(status);
  if (ns === 'completed' || ns === 'cancelled') return 1;
  const elapsed = Math.max(0, now - createdAt);

  if (ns === 'pending') return Math.min((elapsed / MS_2MIN) * 0.25, 0.25);

  if (ns === 'confirmed' || ns === 'order_confirmed') {
    return Math.min(0.25 + (elapsed / MS_2MIN) * 0.25, 0.5);
  }

  if (ns === 'preparing') {
    return Math.min(0.5 + (elapsed / MS_2MIN) * 0.25, 0.75);
  }

  if (ns === 'ready') {
    return Math.min(0.75 + (elapsed / MS_2MIN) * 0.1, 0.85);
  }

  if (ns === 'out_for_delivery' || ns === 'assigned_delivery_boy') {
    return Math.min(0.85 + ((elapsed - MS_2MIN) / (MS_6MIN - MS_2MIN)) * 0.15, 1);
  }

  if (elapsed < MS_2MIN) return Math.min(0.25 + (elapsed / MS_2MIN) * 0.6, 0.85);
  if (elapsed < MS_6MIN) return Math.min(0.85 + ((elapsed - MS_2MIN) / (MS_6MIN - MS_2MIN)) * 0.15, 1);
  return 1;
}

export function getCheckoutOrderSummaries(orders: { id: string; status: string; createdAt?: number }[], now: number = Date.now()): CheckoutActiveOrderSummary[] {
  return getActiveCheckoutOrders(orders)
    .map((order) => {
      const ns = normalizeStatus(order.status);
      const createdAt = order.createdAt || now;
      return {
        id: order.id,
        progress: computeAnimatedProgress(order.status, createdAt, now),
        isOnTheWay: ns === 'out_for_delivery',
      };
    });
}

export function getCheckoutStatusHref(orderIds: string[]) {
  if (orderIds.length === 0) return null;
  if (orderIds.length > 1) return '/menu/checkout/status';
  return `/menu/checkout/status/${encodeURIComponent(orderIds[0])}`;
}
