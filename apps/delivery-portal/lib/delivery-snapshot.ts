import type { DeliveryPortalSnapshot } from './delivery-types';
import type { ApiOrder } from './hooks/use-driver-orders-query';
import { mapApiOrderToDelivery } from './delivery-mappers';

export function buildSnapshot(
  restaurantSlug: string | null,
  driverName: string | null,
  activeOrders: ApiOrder[],
  completedOrders: ApiOrder[]
): DeliveryPortalSnapshot {
  return {
    restaurant: {
      slug: restaurantSlug || 'restaurant',
      name: restaurantSlug || 'Restaurant',
      deliveryDomain: `${restaurantSlug || 'restaurant'}-delivery.localhost`,
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
      completedToday: completedOrders.length,
    },
    metrics: [],
    activeOrders: activeOrders.map(mapApiOrderToDelivery),
    completedOrders: completedOrders.map(mapApiOrderToDelivery),
    routeChecklist: [],
    routeHealthLabel: 'Good',
    supportNotice: '',
  };
}
