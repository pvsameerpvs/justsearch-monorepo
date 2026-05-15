import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface ApiOrder {
  id: string;
  code: string;
  status: string;
  customerName: string;
  customerPhone: string;
  total: string;
  createdAt: string;
  fulfillmentType: string;
}

const POLLING_INTERVAL = 10_000;
const STALE_TIME = 30_000;

interface OrdersResponse {
  orders: ApiOrder[];
}

async function fetchOrders(): Promise<OrdersResponse> {
  return apiClient<OrdersResponse>('/orders');
}

export function useOrdersQuery() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: STALE_TIME,
    refetchInterval: POLLING_INTERVAL,
  });

  return {
    orders: data?.orders ?? [],
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch orders') : null,
    refetch,
  };
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      apiClient(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
