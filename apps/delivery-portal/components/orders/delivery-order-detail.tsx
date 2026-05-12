import { Badge, Card, CardContent, CardHeader, CardTitle } from '@justsearch/ui';
import type { DeliveryOrder } from '@/lib/delivery-types';
import { DeliveryTimelineStep } from './delivery-timeline-step';
import { OperationalDetailsCard } from './operational-details-card';
import { DropoffInstructionsCard } from './dropoff-instructions-card';

const deliveryStatusSteps: DeliveryOrder['status'][] = [
  'assigned',
  'picked_up',
  'on_route',
  'arrived',
  'delivered',
];

function formatStatus(status: DeliveryOrder['status']) {
  return status.replace(/_/g, ' ');
}

function getStatusVariant(
  status: DeliveryOrder['status']
): 'default' | 'warning' | 'success' {
  return status === 'delivered'
    ? 'success'
    : status === 'on_route' || status === 'arrived'
      ? 'warning'
      : 'default';
}

function getStepDescription(step: DeliveryOrder['status']): string {
  switch (step) {
    case 'assigned': return 'Dispatch confirmed the courier and queued the order for pickup.';
    case 'picked_up': return 'The order has been collected from the restaurant and packed.';
    case 'on_route': return 'The courier is moving toward the customer drop-off location.';
    case 'arrived': return 'The courier has reached the destination and is handling the handoff.';
    case 'delivered': return 'The handoff is complete and the delivery is closed.';
  }
}

export function DeliveryOrderDetail({ order }: { order: DeliveryOrder }) {
  const activeIndex = deliveryStatusSteps.indexOf(order.status);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
      <Card className="rounded-3xl border border-slate-200 bg-white/95 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.38)]">
        <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
              Delivery timeline
            </p>
            <CardTitle className="mt-2 text-2xl text-slate-950">
              {order.customerName}
            </CardTitle>
            <p className="mt-2 text-sm text-slate-500">{order.neighborhood}</p>
          </div>
          <Badge variant={getStatusVariant(order.status)}>{formatStatus(order.status)}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {deliveryStatusSteps.map((step, index) => (
            <DeliveryTimelineStep
              key={step}
              index={index}
              isComplete={index <= activeIndex}
              stepLabel={formatStatus(step)}
              description={getStepDescription(step)}
            />
          ))}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <OperationalDetailsCard order={order} />
        <DropoffInstructionsCard order={order} />
      </div>
    </div>
  );
}
