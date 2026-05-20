import { normalizeStatus, getActiveCheckoutOrders } from './checkout-status-normalizer';

const MILESTONES: { status: string; target: number; durationMs?: number }[] = [
  { status: 'pending', target: 0 },
  { status: 'confirmed', target: 0.2, durationMs: 2 * 60 * 1000 },
  { status: 'preparing', target: 0.4, durationMs: 4 * 60 * 1000 },
  { status: 'ready', target: 0.6, durationMs: 2 * 60 * 1000 },
  { status: 'out_for_delivery', target: 0.85, durationMs: 6 * 60 * 1000 },
  { status: 'completed', target: 1 },
];

const TOTAL_MS = 12 * 60 * 1000;

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

export type CheckoutActiveOrderSummary = {
  id: string;
  progress: number;
  isOnTheWay: boolean;
};

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
