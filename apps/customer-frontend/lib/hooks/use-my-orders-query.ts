import { useQuery } from '@tanstack/react-query';
import { fetchMyOrders } from '@/lib/api/orders.api';
import type { Order, OrderItem } from '@justsearch/types';

const STALE_TIME = 30_000;

export function useMyOrdersQuery() {
  return useQuery<{ orders: Array<{ order: Order; items: OrderItem[] }> }>({
    queryKey: ['my-orders'],
    queryFn: fetchMyOrders,
    staleTime: STALE_TIME,
  });
}
