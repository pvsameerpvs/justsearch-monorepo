import type { DeliveryOrder } from '@/lib/delivery-types';

export function getDeliveryStatusVariant(
  status: DeliveryOrder['status']
): 'default' | 'warning' | 'success' {
  switch (status) {
    case 'on_route':
    case 'arrived':
      return 'warning';
    case 'delivered':
      return 'success';
    default:
      return 'default';
  }
}

export function formatDeliveryStatus(status: DeliveryOrder['status']) {
  return status.replace(/_/g, ' ');
}
