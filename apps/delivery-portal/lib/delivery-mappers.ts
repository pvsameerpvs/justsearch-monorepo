import type { DeliveryOrder, DeliveryOrderStatus } from '@/lib/delivery-types';
import type { ApiAssignment } from '@/lib/hooks/use-driver-orders-query';

const STATUS_MAP: Record<string, DeliveryOrderStatus> = {
  assigned: 'assigned',
  picked_up: 'picked_up',
  in_transit: 'on_route',
  delivered: 'delivered',
  cancelled: 'delivered',
};

function formatCurrency(value: number): string {
  return `AED ${value.toFixed(2)}`;
}

export function mapApiAssignmentToDelivery(a: ApiAssignment): DeliveryOrder {
  const subtotal = Number(a.subtotal || 0);
  const deliveryFee = Number(a.delivery_fee || 0);
  const tax = Number(a.tax || 0);
  const total = Number(a.total || 0);
  const status = STATUS_MAP[a.assignment_status] || 'assigned';

  const orderItems = (a.items ?? []).map((item) => ({
    name: item.name,
    quantity: item.quantity,
    price: Number(item.price),
    currency: item.currency || 'AED',
  }));

  const itemCount = orderItems.reduce((sum, i) => sum + i.quantity, 0);

  return {
    id: a.order_id,
    assignmentId: a.assignment_id,
    code: a.code,
    customerName: a.customer_name,
    customerPhone: a.customer_phone,
    neighborhood: '',
    dropoffAddress: a.delivery_address || '',
    latitude: a.lat ? Number(a.lat) : 0,
    longitude: a.lng ? Number(a.lng) : 0,
    orderedAtLabel: new Date(a.assigned_at || a.created_at).toLocaleTimeString(),
    etaMinutes: a.eta_minutes ?? 15,
    itemCount,
    orderValue: formatCurrency(total),
    orderItems,
    subtotal,
    deliveryFee,
    tax,
    total,
    paymentMode: a.payment_method === 'card' ? 'prepaid' : 'cash_on_delivery',
    status,
    priority: 'standard',
    notes: a.notes || undefined,
  };
}
