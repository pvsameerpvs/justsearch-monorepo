"use client";

import { useState, useCallback } from "react";
import { DeliveryPortalShell } from '@/components/layout/delivery-portal-shell';
import { DriverHomeView } from '@/components/orders/driver-home-view';
import { useDriverAuth } from '@/lib/driver-auth-store';
import { useDriverOrdersQuery } from '@/lib/hooks/use-driver-orders-query';
import { buildSnapshot } from '@/lib/delivery-snapshot';
import type { ApiAssignment } from '@/lib/hooks/use-driver-orders-query';

export default function DeliveryPortalPage() {
  const { driverName, restaurantSlug, driverId } = useDriverAuth();
  const { assignments, isLoading, refetch } = useDriverOrdersQuery(driverId);
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

  const snapshot = buildSnapshot(restaurantSlug, driverName, assignments);

  // Dedupe by assignmentId to prevent duplicate keys if API returns stale data
  const allOrders = Array.from(
    new Map([...snapshot.activeOrders, ...snapshot.completedOrders].map((o) => [o.assignmentId, o])).values()
  );

  return (
    <DeliveryPortalShell restaurant={snapshot.restaurant} agent={snapshot.agent}>
      <DriverHomeView orders={allOrders} onRefresh={refresh} isRefreshing={isRefreshing} />
    </DeliveryPortalShell>
  );
}
