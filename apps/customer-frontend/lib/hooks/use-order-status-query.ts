import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Order } from '@justsearch/types';

const POLLING_INTERVAL = 5_000;

export function useOrderStatusQuery(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => apiClient<Order>(`/orders/${orderId}`),
    refetchInterval: POLLING_INTERVAL,
    enabled: Boolean(orderId),
  });
}
