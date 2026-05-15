import type { OrderStatus, PaymentMode } from './index';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Order placed',
  confirmed: 'Order confirmed',
  preparing: 'Preparing your food',
  ready: 'Ready for pickup',
  out_for_delivery: 'On the way',
  completed: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_STAGE: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 0,
  preparing: 1,
  ready: 1,
  out_for_delivery: 2,
  completed: 3,
  cancelled: 0,
};

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  cash: 'Cash',
  card: 'Card',
};
