export const STATUS_LABELS: Record<string, string> = {
  pending: 'Order placed',
  confirmed: 'Order confirmed',
  preparing: 'Preparing your food',
  ready: 'Food is ready',
  out_for_delivery: 'On the way',
  completed: 'Delivered! Enjoy your meal',
  cancelled: 'Order cancelled',
};

export const STATUS_DESCRIPTIONS: Record<string, string> = {
  pending: 'We received your order and are sending it to the restaurant.',
  confirmed: 'The restaurant confirmed your order and will start preparing soon.',
  preparing: 'The kitchen is preparing your food right now.',
  ready: 'Your food is packed and ready for pickup by the driver.',
  out_for_delivery: 'The driver is on the way with your order.',
  completed: 'Your order was delivered successfully. Enjoy your meal!',
  cancelled: 'This order has been cancelled.',
};
