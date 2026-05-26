"use client";

import { DeliveryPortalShell } from '@/components/layout/delivery-portal-shell';
import { DriverSettingsContainer } from '@/components/settings';
import { useDriverAuth } from '@/lib/driver-auth-store';
import { useDriverOrdersQuery } from '@/lib/hooks/use-driver-orders-query';
import { useRestaurantQuery } from '@/lib/hooks/use-restaurant-query';
import { buildSnapshot } from '@/lib/delivery-snapshot';

export default function SettingsPage() {
  const { driverName, restaurantSlug, driverId } = useDriverAuth();
  const { assignments } = useDriverOrdersQuery(driverId);
  const { logoUrl } = useRestaurantQuery();
  const snapshot = buildSnapshot(restaurantSlug, driverName, assignments, logoUrl);

  return (
    <DeliveryPortalShell restaurant={snapshot.restaurant} agent={snapshot.agent}>
      <DriverSettingsContainer
        restaurantName={snapshot.restaurant.name}
        restaurantZone={snapshot.restaurant.zoneLabel}
        restaurantLogoUrl={snapshot.restaurant.logoUrl}
      />
    </DeliveryPortalShell>
  );
}
