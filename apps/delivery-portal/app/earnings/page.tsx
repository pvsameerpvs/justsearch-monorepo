import { DeliveryPortalShell } from '@/components/layout/delivery-portal-shell';
import { DriverEarningsView } from '@/components/orders/driver-earnings-view';
import { getCurrentDeliveryPortalSnapshot } from '@/lib/portal-context';

export default async function EarningsPage() {
  const snapshot = await getCurrentDeliveryPortalSnapshot();
  const delivered = [...snapshot.activeOrders, ...snapshot.completedOrders].filter((o) => o.status === "delivered");

  const totalEarned = delivered.reduce((s, o) => s + o.total, 0);
  const cashCollected = delivered.filter((o) => o.paymentMode === "cash_on_delivery").reduce((s, o) => s + o.total, 0);
  const cardCollected = delivered.filter((o) => o.paymentMode === "prepaid").reduce((s, o) => s + o.total, 0);

  return (
    <DeliveryPortalShell restaurant={snapshot.restaurant} agent={snapshot.agent}>
      <DriverEarningsView
        agentName={snapshot.agent.name}
        totalDeliveries={delivered.length}
        totalEarned={totalEarned}
        cashCollected={cashCollected}
        cardCollected={cardCollected}
      />
    </DeliveryPortalShell>
  );
}
