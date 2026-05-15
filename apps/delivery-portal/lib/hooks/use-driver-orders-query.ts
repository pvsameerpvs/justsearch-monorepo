import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface ApiOrder {
  id: string;
  code: string;
  status: string;
  customerName: string;
  customerPhone: string;
  total: string;
  paymentMethod: string | null;
  createdAt: string;
}

const POLLING_INTERVAL = 10_000;
const STALE_TIME = 30_000;

interface DriverOrdersResponse {
  orders: ApiOrder[];
}

async function fetchDriverOrders(driverId: string): Promise<DriverOrdersResponse> {
  return apiClient<DriverOrdersResponse>(`/orders?driverId=${driverId}`);
}

export function useDriverOrdersQuery(driverId?: string | null) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['driverOrders', driverId],
    queryFn: () => fetchDriverOrders(driverId || ''),
    staleTime: STALE_TIME,
    refetchInterval: POLLING_INTERVAL,
    enabled: Boolean(driverId),
  });

  return {
    orders: data?.orders ?? [],
    isLoading,
    refetch,
  };
}

export function useUpdateDeliveryStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      apiClient(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driverOrders'] });
    },
  });
}
