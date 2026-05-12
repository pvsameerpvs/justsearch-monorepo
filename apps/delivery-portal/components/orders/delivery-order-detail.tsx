import { Badge, Card, CardContent, CardHeader, CardTitle } from '@justsearch/ui';
import { Clock3, MapPin, PackageCheck, ShieldCheck, Wallet } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { DeliveryOrder } from '@/lib/delivery-types';

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
  switch (status) {
    case 'delivered':
      return 'success';
    case 'on_route':
    case 'arrived':
      return 'warning';
    default:
      return 'default';
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
          {deliveryStatusSteps.map((step, index) => {
            const isComplete = index <= activeIndex;

            return (
              <div
                key={step}
                className={cn(
                  'flex gap-4 rounded-2xl border px-4 py-4',
                  isComplete
                    ? 'border-emerald-200 bg-emerald-50/80'
                    : 'border-slate-200 bg-slate-50'
                )}
              >
                <div
                  className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                    isComplete
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-500 border border-slate-200'
                  )}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold capitalize text-slate-950">
                    {formatStatus(step)}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {step === 'assigned'
                      ? 'Dispatch confirmed the courier and queued the order for pickup.'
                      : step === 'picked_up'
                        ? 'The order has been collected from the restaurant and packed.'
                        : step === 'on_route'
                          ? 'The courier is moving toward the customer drop-off location.'
                          : step === 'arrived'
                            ? 'The courier has reached the destination and is handling the handoff.'
                            : 'The handoff is complete and the delivery is closed.'}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-3xl border border-slate-200 bg-white/95 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.38)]">
          <CardHeader>
            <CardTitle className="text-xl text-slate-950">Operational details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Clock3 className="mt-0.5 h-4 w-4 text-orange-500" />
              <div>
                <p className="font-medium text-slate-900">Target ETA</p>
                <p>{order.etaMinutes} minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <PackageCheck className="mt-0.5 h-4 w-4 text-orange-500" />
              <div>
                <p className="font-medium text-slate-900">Packed items</p>
                <p>{order.itemCount} items ready for handoff</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Wallet className="mt-0.5 h-4 w-4 text-orange-500" />
              <div>
                <p className="font-medium text-slate-900">Payment mode</p>
                <p>{order.paymentMode === 'prepaid' ? 'Prepaid' : 'Cash on delivery'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-orange-500" />
              <div>
                <p className="font-medium text-slate-900">Priority</p>
                <p>{order.priority === 'rush' ? 'Rush stop' : 'Standard stop'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-orange-100 bg-orange-50/80 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.38)]">
          <CardHeader>
            <CardTitle className="text-xl text-slate-950">Drop-off instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <div className="flex items-start gap-3 rounded-2xl border border-orange-200 bg-white/80 px-4 py-3">
              <MapPin className="mt-0.5 h-4 w-4 text-orange-500" />
              <div>
                <p className="font-medium text-slate-900">Address</p>
                <p className="mt-1">{order.dropoffAddress}</p>
              </div>
            </div>
            <p>{order.notes ?? 'No extra customer instructions were attached to this stop.'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
