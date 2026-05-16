import type { OrderStatus } from '@justsearch/types';
import type { DeliveryOrder } from '../../use-restaurant-fulfillment';

function getDateParts(value: number | string) {
  const ts = typeof value === 'string' ? new Date(value).getTime() : value;
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(ts);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return {
    day: read('day'),
    month: read('month'),
    hour: read('hour'),
    minute: read('minute'),
  };
}

export function formatOrderCompletionTime(value: number | string) {
  const { day, month, hour, minute } = getDateParts(value);
  return `${day} ${month} at ${hour}:${minute}`;
}

export function formatOrderPlacedTime(value: number | string) {
  const ts = typeof value === 'string' ? new Date(value).getTime() : value;
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(ts);
}

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

export function getOrderListStatusLine(order: DeliveryOrder) {
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

export function getOrderSummarySupportText(order: { status: string; id: string; createdAt: number | string }) {
  switch (order.status as OrderStatus | string) {
    case 'completed':
    case 'delivered':
      return `Your order was completed at ${formatOrderCompletionTime(order.createdAt)}.`;
    case 'out_for_delivery':
    case 'assigned_delivery_boy':
      return `Your delivery partner is heading to your location with order #${order.id}.`;
    case 'preparing':
      return `The kitchen is preparing order #${order.id}.`;
    case 'ready':
      return `Order #${order.id} is packed and ready for pickup.`;
    case 'cancelled':
      return `This order has been cancelled.`;
    case 'confirmed':
    case 'order_confirmed':
    case 'pending':
    default:
      return `The restaurant is preparing order #${order.id} and will update delivery soon.`;
  }
}

export function splitOrderAddress(address: string) {
  return address
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
