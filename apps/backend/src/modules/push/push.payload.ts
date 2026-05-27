import type { NewOrderPushInput, NotificationPayload } from './push.types';

const NOTIFICATION_VIBRATE_PATTERN = [
  800, 200, 800, 200, 800, 400, 1200, 200, 600, 200, 600,
];

function formatCurrency(total: number): string {
  const amount = Number.isFinite(total) ? total : 0;
  return `AED ${amount.toFixed(2)}`;
}

export function buildNewOrderPushPayload({
  orderId,
  orderCode,
  customerAddress,
  total,
}: NewOrderPushInput): NotificationPayload {
  const amount = formatCurrency(total);

  return {
    title: `New Delivery ${orderCode}`,
    body: `${customerAddress} • ${amount}`,
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/icon-192x192.svg',
    tag: `order-${orderId}`,
    requireInteraction: true,
    renotify: true,
    silent: false,
    vibrate: NOTIFICATION_VIBRATE_PATTERN,
    data: { url: '/', orderId, orderCode, total },
    actions: [
      { action: 'open', title: 'View Order' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };
}
