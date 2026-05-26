import type { DeliveryPortalSnapshot } from './delivery-types';
import type { ApiAssignment } from './hooks/use-driver-orders-query';
import { mapApiAssignmentToDelivery } from './delivery-mappers';

export function buildSnapshot(
  restaurantSlug: string | null,
  driverName: string | null,
  assignments: ApiAssignment[],
  logoUrl?: string,
): DeliveryPortalSnapshot {
  const active = assignments.filter((a) => a.assignment_status !== 'delivered' && a.assignment_status !== 'cancelled');
  const completed = assignments.filter((a) => a.assignment_status === 'delivered' || a.assignment_status === 'cancelled');

  const slug = restaurantSlug || 'restaurant';
  const name = restaurantSlug || 'Restaurant';

  return {
    restaurant: {
      slug,
      name,
      logoUrl,
      deliveryDomain: `${slug}-delivery.localhost`,
      zoneLabel: 'Zone A',
      supportPhone: '+971 4 000 0000',
    },
    agent: {
      id: 'driver-1',
      name: driverName || 'Driver',
      phone: '+971 50 000 0000',
      vehicleType: 'Scooter',
      shiftLabel: 'Active',
      status: 'online',
      rating: 4.9,
      completedToday: completed.length,
    },
    metrics: [],
    activeOrders: active.map(mapApiAssignmentToDelivery),
    completedOrders: completed.map(mapApiAssignmentToDelivery),
    routeChecklist: [],
    routeHealthLabel: 'Good',
    supportNotice: '',
  };
}
