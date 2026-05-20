export type CheckoutLiveStage = {
  id: string;
  label: string;
  description: string;
};

export function getCheckoutLiveStages(riderName?: string | null): CheckoutLiveStage[] {
  const rider = riderName?.trim() || 'Your delivery partner';
  return [
    { id: 'accepted', label: 'Order accepted', description: 'The restaurant confirmed your order.' },
    { id: 'preparing', label: 'Preparing your food', description: 'The kitchen is cooking your order right now.' },
    { id: 'ready', label: 'Order ready', description: 'Your food is packed and waiting for the driver.' },
    { id: 'assigned', label: 'On the way', description: `${rider} is heading to you with your order.` },
    { id: 'completed', label: 'Delivered', description: 'Your order was delivered successfully.' },
  ];
}

export function getCheckoutStatusHref(orderIds: string[]) {
  if (orderIds.length === 0) return null;
  if (orderIds.length > 1) return '/menu/checkout/status';
  return `/menu/checkout/status/${encodeURIComponent(orderIds[0])}`;
}
