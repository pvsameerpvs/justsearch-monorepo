"use client";

import { DeliveryPortalShell } from '@/components/layout/delivery-portal-shell';
import { DriverHomeView } from '@/components/orders/driver-home-view';
import { DriverOrderIncomingAlert } from '@/components/orders/driver-order-incoming-alert';
import { useOrderNotification } from '@/lib/hooks/use-order-notification';
import { useHomePage } from './page.hooks';

export default function DeliveryPortalPage() {
  const { isLoading, refresh, isRefreshing, snapshot, allOrders, activeOrders } = useHomePage();
  const { incoming, dismiss } = useOrderNotification(activeOrders);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <DeliveryPortalShell restaurant={snapshot.restaurant} agent={snapshot.agent}>
      <DriverHomeView orders={allOrders} onRefresh={refresh} isRefreshing={isRefreshing} />
      <DriverOrderIncomingAlert orders={incoming} onDismiss={dismiss} />
    </DeliveryPortalShell>
  );
}
