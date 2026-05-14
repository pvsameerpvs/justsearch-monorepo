import { Badge, CardHeader, CardTitle } from '@justsearch/ui';
import { getDeliveryStatusVariant, formatDeliveryStatus } from '@/lib/delivery-status-helpers';
import type { DeliveryOrder } from '@/lib/delivery-types';

export function DeliveryOrderCardHeader({ order }: { order: DeliveryOrder }) {
  return (
    <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-xl text-slate-950">{order.code}</CardTitle>
          <Badge variant={getDeliveryStatusVariant(order.status)}>{formatDeliveryStatus(order.status)}</Badge>
          <Badge variant={order.priority === 'rush' ? 'warning' : 'default'}>
            {order.priority === 'rush' ? 'Rush' : 'Standard'}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{order.customerName}</p>
          <p className="text-sm text-slate-500">{order.neighborhood}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Order value
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          {order.orderValue}
        </p>
      </div>
    </CardHeader>
  );
}
