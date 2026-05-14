import { Navigation } from 'lucide-react';
import { Badge, Button, PageHeader } from '@justsearch/ui';
import { DeliveryAgentPanel } from '@/components/dashboard/delivery-agent-panel';
import { DeliveryMetricCard } from '@/components/dashboard/delivery-metric-card';
import { DeliveryOrderCard } from '@/components/dashboard/delivery-order-card';
import { CompletedOrdersCard } from '@/components/dashboard/completed-orders-card';
import { DispatchNoteCard } from '@/components/dashboard/dispatch-note-card';
import { DeliveryPortalShell } from '@/components/layout/delivery-portal-shell';
import { getCurrentDeliveryPortalSnapshot } from '@/lib/portal-context';

export default async function DeliveryPortalPage() {
  const snapshot = await getCurrentDeliveryPortalSnapshot();

  return (
    <DeliveryPortalShell
      restaurant={snapshot.restaurant}
      agent={snapshot.agent}
      routeHealthLabel={snapshot.routeHealthLabel}
    >
      <PageHeader
        title={`${snapshot.restaurant.name} Delivery Portal`}
        description={`Live dispatch board for ${snapshot.restaurant.zoneLabel}.`}
      >
        <Badge variant="success">Live shift</Badge>
        <Button size="sm" variant="secondary">
          Refresh queue
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.metrics.map((metric) => (
          <DeliveryMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Active drop-offs
              </h2>
              <p className="text-sm text-slate-500">
                Orders currently assigned to the active route.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
              <Navigation className="h-3.5 w-3.5" />
              {snapshot.activeOrders.length} live stops
            </div>
          </div>

          <div className="space-y-4">
            {snapshot.activeOrders.map((order) => (
              <DeliveryOrderCard key={order.id} order={order} />
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <DeliveryAgentPanel
            agent={snapshot.agent}
            routeChecklist={snapshot.routeChecklist}
          />

          <CompletedOrdersCard orders={snapshot.completedOrders} />
          <DispatchNoteCard notice={snapshot.supportNotice} />
        </aside>
      </div>
    </DeliveryPortalShell>
  );
}
