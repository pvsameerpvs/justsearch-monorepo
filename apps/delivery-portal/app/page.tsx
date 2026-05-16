"use client";

import { useState, useCallback } from "react";
import { DeliveryPortalShell } from '@/components/layout/delivery-portal-shell';
import { DriverHomeView } from '@/components/orders/driver-home-view';
import { useDriverAuth } from '@/lib/driver-auth-store';
import { useDriverOrdersQuery } from '@/lib/hooks/use-driver-orders-query';
import { buildSnapshot } from '@/lib/delivery-snapshot';
import type { ApiOrder } from '@/lib/hooks/use-driver-orders-query';

export default function DeliveryPortalPage() {
  const { driverName, restaurantSlug, driverId } = useDriverAuth();
  const { orders, isLoading, refetch } = useDriverOrdersQuery(driverId);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const activeOrders = orders.filter((o: ApiOrder) => !['completed', 'cancelled'].includes(o.status));
  const completedOrders = orders.filter((o: ApiOrder) => ['completed', 'cancelled'].includes(o.status));
  const snapshot = buildSnapshot(restaurantSlug, driverName, activeOrders, completedOrders);
  const allOrders = [...snapshot.activeOrders, ...snapshot.completedOrders];

  return (
    <DeliveryPortalShell restaurant={snapshot.restaurant} agent={snapshot.agent}>
      <DriverHomeView orders={allOrders} onRefresh={refresh} isRefreshing={isRefreshing} />
    </DeliveryPortalShell>
  );
}
