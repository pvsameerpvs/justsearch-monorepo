import type { DeliveryPortalSnapshot } from './delivery-types';
import type { ApiAssignment } from './hooks/use-driver-orders-query';
import { mapApiAssignmentToDelivery } from './delivery-mappers';

type SnapshotRestaurantSource = {
  slug?: string | null;
  subdomain?: string | null;
  name?: string | null;
  settings?: {
    logoUrl?: string;
  } | null;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function formatRestaurantFallback(value: string) {
  if (!value || UUID_PATTERN.test(value)) return 'Restaurant';
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function buildSnapshot(
  restaurantSlug: string | null,
  driverName: string | null,
  assignments: ApiAssignment[],
  restaurant?: SnapshotRestaurantSource | null,
): DeliveryPortalSnapshot {
  const active = assignments.filter((a) => a.assignment_status !== 'delivered' && a.assignment_status !== 'cancelled');
  const completed = assignments.filter((a) => a.assignment_status === 'delivered' || a.assignment_status === 'cancelled');

  const slug = restaurant?.subdomain || restaurant?.slug || restaurantSlug || 'restaurant';
  const name = restaurant?.name || formatRestaurantFallback(slug);
  const logoUrl = restaurant?.settings?.logoUrl || undefined;

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
