import { formatCurrency } from './format';

export function formatDeliveryFeeLabel(fee: number, currency: string): string {
  if (fee <= 0) return 'Free';
  return formatCurrency(fee, currency);
}

export function formatDeliveryFeeBadge(fee: number, currency: string): string {
  if (fee <= 0) return 'Free delivery';
  return `Delivery ${formatCurrency(fee, currency)}`;
}
