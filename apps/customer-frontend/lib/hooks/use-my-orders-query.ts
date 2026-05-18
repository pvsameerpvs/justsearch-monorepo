import { useQuery } from '@tanstack/react-query';
import { fetchMyOrders } from '@/lib/api/orders.api';
import type { MyOrdersAllResponse } from '@/lib/api/orders.api';

const STALE_TIME = 30_000;

export function useMyOrdersQuery() {
  return useQuery<MyOrdersAllResponse>({
    queryKey: ['my-orders'],
    queryFn: fetchMyOrders,
    staleTime: STALE_TIME,
  });
}
