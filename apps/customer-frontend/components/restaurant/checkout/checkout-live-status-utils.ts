const LOCAL_TO_BACKEND: Record<string, string> = {
  order_confirmed: 'confirmed',
  assigned_delivery_boy: 'out_for_delivery',
  delivered: 'completed',
};

function normalizeStatus(status: string): string {
  return LOCAL_TO_BACKEND[status] || status;
}

const STAGE_ORDER: Record<string, number> = {
  pending: 0, confirmed: 0,
  preparing: 1, ready: 1,
  out_for_delivery: 2,
  completed: 3, cancelled: 0,
};

export function getCheckoutStageIndex(status: string): number {
  return STAGE_ORDER[normalizeStatus(status)] ?? 0;
}

export type CheckoutActiveOrderSummary = {
  id: string;
  progress: number;
  isOnTheWay: boolean;
};

export function getActiveCheckoutOrders<T extends { status: string }>(orders: T[]): T[] {
  return orders.filter((o) => {
    const ns = normalizeStatus(o.status);
    return ns !== 'completed' && ns !== 'cancelled';
  });
}

const MILESTONES: { status: string; target: number; durationMs?: number }[] = [
  { status: 'pending', target: 0 },
  { status: 'confirmed', target: 0.25, durationMs: 2 * 60 * 1000 },
  { status: 'preparing', target: 0.5, durationMs: 2 * 60 * 1000 },
  { status: 'ready', target: 0.75, durationMs: 2 * 60 * 1000 },
  { status: 'out_for_delivery', target: 0.85, durationMs: 2 * 60 * 1000 },
  { status: 'completed', target: 1 },
];

const TOTAL_MS = 6 * 60 * 1000;

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

function computeProgress(status: string, createdAt: number, now: number): number {
  const ns = normalizeStatus(status);
  if (ns === 'completed' || ns === 'cancelled') return 1;

  const idx = MILESTONES.findIndex((m) => m.status === ns);
  if (idx < 0) return 0;

  const current = MILESTONES[idx];
  const next = MILESTONES[idx + 1];

  if (!next) return current.target;

  const elapsed = Math.max(0, now - createdAt);
  const duration = next.durationMs || TOTAL_MS;
  const progress = current.target + (elapsed / duration) * (next.target - current.target);

  return Math.min(progress, next.target);
}

export function getCheckoutOrderSummaries(
  orders: { id: string; status: string; createdAt?: number }[],
  now: number = Date.now(),
): CheckoutActiveOrderSummary[] {
  return getActiveCheckoutOrders(orders).map((order) => {
    const ns = normalizeStatus(order.status);
    return {
      id: order.id,
      progress: computeProgress(order.status, order.createdAt || now, now),
      isOnTheWay: ns === 'out_for_delivery',
    };
  });
}

export function getCheckoutStatusHref(orderIds: string[]) {
  if (orderIds.length === 0) return null;
  if (orderIds.length > 1) return '/menu/checkout/status';
  return `/menu/checkout/status/${encodeURIComponent(orderIds[0])}`;
}
