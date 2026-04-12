import type { DeliveryOrder, DeliveryOrderStatus } from '../../use-restaurant-fulfillment';

function getDateParts(value: number) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(value);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return {
    day: read('day'),
    month: read('month'),
    hour: read('hour'),
    minute: read('minute'),
  };
}

export function formatOrderCompletionTime(value: number) {
  const { day, month, hour, minute } = getDateParts(value);
  return `${day} ${month} at ${hour}:${minute}`;
}

export function formatOrderPlacedTime(value: number) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(value);
}

export function getOrderStatusLabel(status: DeliveryOrderStatus) {
  switch (status) {
    case 'delivered':
      return 'Delivered';
    case 'assigned_delivery_boy':
      return 'Out for delivery';
    case 'order_confirmed':
    default:
      return 'Order confirmed';
  }
}

export function getOrderListStatusLine(order: DeliveryOrder) {
  return `${getOrderStatusLabel(order.status)} · Completion time: ${formatOrderCompletionTime(order.createdAt)}`;
}

export function getOrderItemsPreview(order: DeliveryOrder) {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const preview = order.items
    .slice(0, 2)
    .map((item) => `${item.quantity} x ${item.name}`)
    .join(', ');

  return `${totalItems} ${totalItems === 1 ? 'item' : 'items'}: ${preview}`;
}

export function getOrderSummaryHeadline(status: DeliveryOrderStatus) {
  switch (status) {
    case 'delivered':
      return 'Order arrived successfully';
    case 'assigned_delivery_boy':
      return 'Order is on the way';
    case 'order_confirmed':
    default:
      return 'Restaurant confirmed your order';
  }
}

export function getOrderSummarySupportText(order: DeliveryOrder) {
  switch (order.status) {
    case 'delivered':
      return `Your order was completed at ${formatOrderCompletionTime(order.createdAt)}.`;
    case 'assigned_delivery_boy':
      return `Your delivery partner is heading to your location with order #${order.id}.`;
    case 'order_confirmed':
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
