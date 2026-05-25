import { useQuery } from '@tanstack/react-query';
import { fetchMyOrders, type CrossRestaurantOrder } from '@/lib/api/orders.api';
import { useRegistration } from '@/components/auth/registration-context';

const POLLING_INTERVAL = 5_000;
const STALE_TIME = 30_000;

export function useMyOrdersQuery() {
  const { user } = useRegistration();
  const userId = user?.id;

  return useQuery<CrossRestaurantOrder[]>({
    queryKey: ['my-orders', userId],
    queryFn: async () => {
      const res = await fetchMyOrders();
      return res.orders;
    },
    staleTime: STALE_TIME,
    refetchInterval: POLLING_INTERVAL,
    enabled: Boolean(userId),
  });
}
