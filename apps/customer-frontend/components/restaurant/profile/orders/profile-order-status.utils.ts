import type { OrderStatus } from '@justsearch/types';
import type { DeliveryOrder } from '../../use-restaurant-fulfillment';
import { formatOrderCompletionTime } from './profile-order-date.utils';

export function getOrderStatusLabel(status: OrderStatus | string) {
  switch (status) {
    case 'completed':
    case 'delivered':
      return 'Delivered';
    case 'out_for_delivery':
    case 'assigned_delivery_boy':
      return 'Out for delivery';
    case 'preparing':
      return 'Preparing';
    case 'ready':
      return 'Ready';
    case 'cancelled':
      return 'Cancelled';
    case 'confirmed':
    case 'order_confirmed':
    case 'pending':
    default:
      return 'Order confirmed';
  }
}

export function getOrderListStatusLine(order: { status: string; createdAt: number | string }) {
  return `${getOrderStatusLabel(order.status)} · Placed ${formatOrderCompletionTime(order.createdAt)}`;
}

export function getOrderItemsPreview(order: DeliveryOrder) {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const preview = order.items
    .slice(0, 2)
    .map((item) => `${item.quantity} x ${item.name}`)
    .join(', ');

  return `${totalItems} ${totalItems === 1 ? 'item' : 'items'}: ${preview}`;
}

export function getOrderSummaryHeadline(status: OrderStatus | string) {
  switch (status) {
    case 'completed':
    case 'delivered':
      return 'Order arrived successfully';
    case 'out_for_delivery':
    case 'assigned_delivery_boy':
      return 'Order is on the way';
    case 'preparing':
      return 'Preparing your food';
    case 'ready':
      return 'Food is ready';
    case 'cancelled':
      return 'Order cancelled';
    case 'confirmed':
    case 'order_confirmed':
    case 'pending':
    default:
      return 'Restaurant confirmed your order';
  }
}
