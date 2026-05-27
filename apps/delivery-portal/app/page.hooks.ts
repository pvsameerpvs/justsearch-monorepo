"use client";

import { useState, useCallback } from "react";
import { useDriverAuth } from '@/lib/driver-auth-store';
import { useDriverOrdersQuery } from '@/lib/hooks/use-driver-orders-query';
import { useRestaurantQuery } from '@/lib/hooks/use-restaurant-query';
import { buildSnapshot } from '@/lib/delivery-snapshot';

export function useHomePage() {
  const { driverName, restaurantSlug, driverId } = useDriverAuth();
  const { assignments, isLoading, refetch } = useDriverOrdersQuery(driverId);
  const { logoUrl } = useRestaurantQuery();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [refetch]);

  const activeOrders = assignments
    .filter((a) => a.assignment_status !== 'delivered' && a.assignment_status !== 'cancelled')
    .map((a) => ({
      assignmentId: a.assignment_id,
      orderId: a.order_id,
      code: a.code,
      customerName: a.customer_name,
      orderValue: `AED ${Number(a.total || 0).toFixed(2)}`,
      etaMinutes: a.eta_minutes ?? 15,
    }));

  const snapshot = buildSnapshot(restaurantSlug, driverName, assignments, logoUrl);

  const allOrders = Array.from(
    new Map([...snapshot.activeOrders, ...snapshot.completedOrders].map((o) => [o.assignmentId, o])).values()
  );

  return {
    isLoading,
    refresh,
    isRefreshing,
    snapshot,
    allOrders,
    activeOrders,
  };
}
