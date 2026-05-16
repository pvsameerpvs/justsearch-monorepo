import { useQuery } from '@tanstack/react-query';
import { fetchOrder } from '@/lib/api/orders.api';
import type { Order, OrderItem } from '@justsearch/types';

const POLLING_INTERVAL = 5_000;

export function useOrderStatusQuery(orderId: string) {
  return useQuery<{ order: Order; items: OrderItem[] }>({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrder(orderId),
    refetchInterval: (query) =>
      query.state.data?.order?.status &&
      !['completed', 'cancelled'].includes(query.state.data.order.status)
        ? POLLING_INTERVAL
        : false,
    enabled: Boolean(orderId),
  });
}
