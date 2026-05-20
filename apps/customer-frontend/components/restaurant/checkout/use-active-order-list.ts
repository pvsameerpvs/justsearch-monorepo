import type { CrossRestaurantOrder } from '@/lib/api/orders.api';
import type { DeliveryOrder } from '@/components/restaurant/use-restaurant-fulfillment';
import { normalizeStatus } from './checkout-status-normalizer';

export type ActiveListOrder = {
  id: string;
  code: string;
  status: string;
  createdAt: string;
  address?: string;
  total: string;
  restaurantName?: string;
};

export function mergeActiveOrders(
  apiOrders: CrossRestaurantOrder[] | undefined,
  localOrders: DeliveryOrder[],
): ActiveListOrder[] {
  if (apiOrders === undefined) {
    // Fallback: API hasn't loaded yet — show local store briefly
    return localOrders
      .filter((o) => {
        const ns = normalizeStatus(o.status);
        return ns !== 'completed' && ns !== 'cancelled';
      })
      .map((o) => ({
        id: o.id,
        code: o.id.slice(0, 8),
        status: o.status,
        createdAt: new Date(o.createdAt).toISOString(),
        address: o.address,
        total: String(o.total),
      }));
  }

  // API has loaded — trust it exclusively (even if empty)
  const localMap = new Map(localOrders.map((o) => [o.id, o]));

  return apiOrders
    .filter((o) => {
      const ns = normalizeStatus(o.status);
      return ns !== 'completed' && ns !== 'cancelled';
    })
    .map((apiOrder) => {
      const local = localMap.get(apiOrder.id);
      return {
        id: apiOrder.id,
        code: apiOrder.code,
        status: apiOrder.status,
        createdAt: apiOrder.createdAt,
        address: local?.address,
        total: apiOrder.total,
        restaurantName: apiOrder.restaurantName,
      };
    });
}
