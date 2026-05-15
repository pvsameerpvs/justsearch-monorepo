import type { DeliveryOrder, DeliveryOrderStatus } from '@/lib/delivery-types';
import type { ApiOrder } from '@/lib/hooks/use-delivery-orders-query';

const STATUS_MAP: Record<string, DeliveryOrderStatus> = {
  pending: 'assigned',
  confirmed: 'assigned',
  preparing: 'picked_up',
  ready: 'on_route',
  out_for_delivery: 'on_route',
  completed: 'delivered',
  cancelled: 'delivered',
};

export function mapApiOrderToDelivery(o: ApiOrder): DeliveryOrder {
  return {
    id: o.id,
    code: o.code,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    neighborhood: '',
    dropoffAddress: '',
    latitude: 0,
    longitude: 0,
    orderedAtLabel: new Date(o.createdAt).toLocaleTimeString(),
    etaMinutes: 15,
    itemCount: 0,
    orderValue: o.total,
    orderItems: [],
    subtotal: Number(o.total),
    deliveryFee: 0,
    tax: 0,
    total: Number(o.total),
    paymentMode: 'cash_on_delivery',
    status: STATUS_MAP[o.status] || 'assigned',
    priority: 'standard',
  };
}
