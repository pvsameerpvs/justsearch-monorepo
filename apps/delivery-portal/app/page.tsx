"use client";

import { useState, useCallback } from "react";
import { DeliveryPortalShell } from '@/components/layout/delivery-portal-shell';
import { DriverHomeView } from '@/components/orders/driver-home-view';
import { useDriverAuth } from '@/lib/driver-auth-store';
import { useDriverOrdersQuery } from '@/lib/hooks/use-driver-orders-query';
import { mapApiOrderToDelivery } from '@/lib/delivery-mappers';
import type { DeliveryPortalSnapshot } from '@/lib/delivery-types';

import type { ApiOrder } from '@/lib/hooks/use-driver-orders-query';

function buildSnapshot(
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

export default function DeliveryPortalPage() {
  const { driverName, restaurantSlug, driverId } = useDriverAuth();
  const { orders, isLoading, refetch } = useDriverOrdersQuery(driverId);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [refetch]);

  const activeOrders = orders.filter((o: ApiOrder) => !['completed', 'cancelled'].includes(o.status));
  const completedOrders = orders.filter((o: ApiOrder) => ['completed', 'cancelled'].includes(o.status));

  const snapshot = buildSnapshot(restaurantSlug, driverName, activeOrders, completedOrders);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const allOrders = [...snapshot.activeOrders, ...snapshot.completedOrders];

  return (
    <DeliveryPortalShell restaurant={snapshot.restaurant} agent={snapshot.agent}>
      <DriverHomeView orders={allOrders} onRefresh={refresh} isRefreshing={isRefreshing} />
    </DeliveryPortalShell>
  );
}
