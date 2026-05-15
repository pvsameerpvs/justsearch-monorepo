import type { DashboardOrder, OrderStatus, OrderItem } from "@/lib/stores/order-store";
import type { ApiOrder, ApiOrderItem } from "@/lib/hooks/use-orders-query";

export function mapApiOrderToDashboard(o: ApiOrder): DashboardOrder {
  const fulfillmentType = (o.fulfillmentType || 'delivery') as 'dine_in' | 'delivery' | 'pickup';
  const paymentMethod = o.paymentMethod || 'cash';

  return {
    id: o.id,
    code: o.code,
    status: o.status as OrderStatus,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    items: o.items ?? 0,
    total: Number(o.total),
    subtotal: Number(o.subtotal),
    deliveryFee: Number(o.deliveryFee),
    tax: Number(o.tax),
    type: fulfillmentType,
    address: o.deliveryAddress || '',
    paymentMethod,
    notes: o.notes || undefined,
    assignedAgentId: o.driverId || null,
    createdAt: o.createdAt,
    orderItems: [],
    timeline: [],
  };
}

export function mapApiOrderDetailToDashboard(o: ApiOrder, items?: ApiOrderItem[]): DashboardOrder {
  return {
    ...mapApiOrderToDashboard(o),
    orderItems: (items ?? []).map((i): OrderItem => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      price: Number(i.price),
      currency: i.currency,
    })),
  };
}
