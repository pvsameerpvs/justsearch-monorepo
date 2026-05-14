import { DeliveryPortalShell } from '@/components/layout/delivery-portal-shell';
import { DriverCompletedSection } from '@/components/orders/driver-completed-section';
import { getCurrentDeliveryPortalSnapshot } from '@/lib/portal-context';

export default async function HistoryPage() {
  const snapshot = await getCurrentDeliveryPortalSnapshot();
  const allOrders = [...snapshot.activeOrders, ...snapshot.completedOrders];

  return (
    <DeliveryPortalShell
      restaurant={snapshot.restaurant}
      agent={snapshot.agent}
    >
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
