import { Badge, Button, Card, CardContent, CardHeader, CardTitle, PageHeader } from '@justsearch/ui';
import { AlertTriangle, Navigation, Sparkles } from 'lucide-react';
import { DeliveryAgentPanel } from '@/components/dashboard/delivery-agent-panel';
import { DeliveryMetricCard } from '@/components/dashboard/delivery-metric-card';
import { DeliveryOrderCard } from '@/components/dashboard/delivery-order-card';
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

          <Card className="rounded-3xl border border-orange-100 bg-white/95 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.38)]">
            <CardHeader className="space-y-2">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl text-slate-950">Completed this shift</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {snapshot.completedOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{order.code}</p>
                      <p className="text-xs text-slate-500">{order.customerName}</p>
                    </div>
                    <Badge variant="success">Delivered</Badge>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {order.neighborhood} and handed over {order.orderedAtLabel}.
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-amber-200 bg-amber-50/90 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.38)]">
            <CardHeader className="space-y-2">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl text-slate-950">Dispatch note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-700">{snapshot.supportNotice}</p>
              <div className="rounded-2xl border border-amber-200 bg-white/80 px-4 py-3 text-xs text-slate-600">
                Prioritize rush orders first, then group nearby standard stops to keep
                average route time low.
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </DeliveryPortalShell>
  );
}
