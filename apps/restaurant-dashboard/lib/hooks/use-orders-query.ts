import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface ApiOrder {
  id: string;
  code: string;
  status: string;
  customerName: string;
  customerPhone: string;
  subtotal: string;
  deliveryFee: string;
  tax: string;
  total: string;
  createdAt: string;
  fulfillmentType: string;
  deliveryAddress: string | null;
  paymentMethod: string | null;
  driverId: string | null;
  notes: string | null;
  cancelReason: string | null;
  items?: number;
}

export interface ApiOrderItem {
  id: string;
  orderId: string;
  name: string;
  quantity: number;
  price: string;
  currency: string;
}

const POLLING_INTERVAL = 10_000;
const STALE_TIME = 30_000;

export interface OrdersResponse {
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

async function fetchOrderDetail(orderId: string): Promise<{ order: ApiOrder; items: ApiOrderItem[] }> {
  return apiClient(`/orders/${orderId}`);
}

export function useOrderDetailQuery(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderDetail(orderId),
    staleTime: STALE_TIME,
    enabled: Boolean(orderId),
    refetchInterval: POLLING_INTERVAL,
  });
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status, cancelReason }: { orderId: string; status: string; cancelReason?: string }) =>
      apiClient(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, cancelReason }),
      }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', vars.orderId] });
    },
  });
}
