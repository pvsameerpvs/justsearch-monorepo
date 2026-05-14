"use client";

import { useState, useEffect, useCallback } from "react";
import { DeliveryPortalShell } from '@/components/layout/delivery-portal-shell';
import { DriverHomeView } from '@/components/orders/driver-home-view';
import { getCurrentDeliveryPortalSnapshot } from '@/lib/portal-context';
import type { DeliveryPortalSnapshot } from '@/lib/delivery-types';

export default function DeliveryPortalPage() {
  const [snapshot, setSnapshot] = useState<DeliveryPortalSnapshot | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await getCurrentDeliveryPortalSnapshot();
    setSnapshot(data);
  }, []);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await load();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  if (!snapshot) return null;

  const allOrders = [...snapshot.activeOrders, ...snapshot.completedOrders];

  return (
    <DeliveryPortalShell restaurant={snapshot.restaurant} agent={snapshot.agent}>
      <DriverHomeView orders={allOrders} onRefresh={refresh} isRefreshing={isRefreshing} />
    </DeliveryPortalShell>
  );
}
