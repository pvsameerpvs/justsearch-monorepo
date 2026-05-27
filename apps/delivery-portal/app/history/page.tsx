"use client";

import { DeliveryPortalShell } from '@/components/layout/delivery-portal-shell';
import { DriverCompletedSection } from '@/components/orders/driver-completed-section';
import { useDriverAuth } from '@/lib/driver-auth-store';
import { useDriverOrdersQuery } from '@/lib/hooks/use-driver-orders-query';
import { useRestaurantQuery } from '@/lib/hooks/use-restaurant-query';
import { buildSnapshot } from '@/lib/delivery-snapshot';

export default function HistoryPage() {
  const { driverName, restaurantSlug, driverId } = useDriverAuth();
  const { assignments } = useDriverOrdersQuery(driverId);
  const { restaurant, restaurantSlug: currentRestaurantSlug } = useRestaurantQuery();
  const snapshot = buildSnapshot(currentRestaurantSlug ?? restaurantSlug, driverName, assignments, restaurant);
  const allOrders = [...snapshot.activeOrders, ...snapshot.completedOrders];

  return (
    <DeliveryPortalShell restaurant={snapshot.restaurant} agent={snapshot.agent}>
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Order history</h1>
          <p className="text-xs text-slate-500">All your completed deliveries</p>
        </div>
        <DriverCompletedSection orders={allOrders} />
      </div>
    </DeliveryPortalShell>
  );
}
