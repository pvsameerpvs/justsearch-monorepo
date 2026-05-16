import { useQuery } from '@tanstack/react-query';
import { fetchOrder } from '@/lib/api/orders.api';

const POLLING_INTERVAL = 5_000;

export function useOrderStatusQuery(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrder(orderId),
    refetchInterval: (query) =>
      query.state.data?.status && !['completed', 'cancelled'].includes(query.state.data.status)
        ? POLLING_INTERVAL
        : false,
    enabled: Boolean(orderId),
  });
}
