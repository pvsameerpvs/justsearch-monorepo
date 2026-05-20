import type { CrossRestaurantOrder } from '@/lib/api/orders.api';
import { normalizeStatus } from './checkout-status-normalizer';
import type { CheckoutActiveOrderSummary } from './checkout-order-summaries';

export function mapApiOrdersToSummaries(
  apiOrders: CrossRestaurantOrder[] | undefined,
): CheckoutActiveOrderSummary[] {
  if (!apiOrders) return [];

  return apiOrders
    .filter((o) => {
      const ns = normalizeStatus(o.status);
      return ns !== 'completed' && ns !== 'cancelled';
    })
    .map((o) => {
      const ns = normalizeStatus(o.status);
      // Compute a realistic progress based on status stage
      const stageProgress: Record<string, number> = {
        pending: 0.05,
        confirmed: 0.15,
        preparing: 0.35,
        ready: 0.55,
        out_for_delivery: 0.75,
      };
      return {
        id: o.id,
        progress: stageProgress[ns] ?? 0.1,
        isOnTheWay: ns === 'out_for_delivery',
      };
    });
}
