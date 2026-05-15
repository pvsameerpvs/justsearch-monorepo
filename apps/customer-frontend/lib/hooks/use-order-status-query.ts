import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Order } from '@justsearch/types';

const POLLING_INTERVAL = 5_000;
const STALE_TIME = 30_000;

const STATUS_MAP: Record<string, string> = {
  order_confirmed: 'confirmed',
  assigned_delivery_boy: 'out_for_delivery',
  delivered: 'completed',
};

type LocalOrderSummary = {
  id: string;
  status?: string;
  total: number;
  createdAt: number;
  address: string;
};

function mapLocal(local: LocalOrderSummary): Order {
  const mappedStatus = local.status ? (STATUS_MAP[local.status] || local.status) : 'pending';
  return {
    id: local.id,
    code: local.id.slice(0, 8).toUpperCase(),
    status: mappedStatus as Order['status'],
    customerName: '',
    customerPhone: '',
    subtotal: local.total,
    deliveryFee: 0,
    tax: 0,
    total: local.total,
    paymentMode: 'cash',
    paymentStatus: 'unpaid',
    driverId: null,
    restaurantId: '',
    deliveryAddress: local.address,
    notes: '',
    createdAt: new Date(local.createdAt).toISOString(),
    updatedAt: new Date(local.createdAt).toISOString(),
  };
}

export function useOrderStatusQuery(orderId: string, localOrders?: LocalOrderSummary[]) {
  const localOrder = localOrders?.find((o) => o.id === orderId);

  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      try {
        return await apiClient<Order>(`/orders/${orderId}`);
      } catch {
        if (localOrder) return mapLocal(localOrder);
        throw new Error('Order not found');
      }
    },
    staleTime: localOrder ? 0 : STALE_TIME,
    refetchInterval: localOrder ? false : POLLING_INTERVAL,
    enabled: Boolean(orderId),
  });
}
