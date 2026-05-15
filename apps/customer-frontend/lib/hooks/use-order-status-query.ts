import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Order } from '@justsearch/types';

const POLLING_INTERVAL = 5_000;
const STALE_TIME = 30_000;

async function fetchOrderStatus(orderId: string): Promise<Order> {
  return apiClient<Order>(`/orders/${orderId}`);
}

export function useOrderStatusQuery(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderStatus(orderId),
    staleTime: STALE_TIME,
    refetchInterval: POLLING_INTERVAL,
    enabled: Boolean(orderId),
  });
}
