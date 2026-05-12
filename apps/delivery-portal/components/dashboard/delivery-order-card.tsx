import Link from 'next/link';
import { Card, CardContent } from '@justsearch/ui';
import { Clock3, MapPin, Package2, Wallet } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { DeliveryOrder } from '@/lib/delivery-types';
import { DeliveryOrderCardHeader } from './delivery-order-card-header';

export function DeliveryOrderCard({ order }: { order: DeliveryOrder }) {
  return (
    <Card className="rounded-3xl border border-slate-200 bg-white/95 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.38)] transition-transform hover:-translate-y-0.5">
      <DeliveryOrderCardHeader order={order} />

      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
          <div className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Clock3 className="mt-0.5 h-4 w-4 text-orange-500" />
            <div>
              <p className="font-medium text-slate-900">ETA</p>
              <p>{order.etaMinutes} mins</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Package2 className="mt-0.5 h-4 w-4 text-orange-500" />
            <div>
              <p className="font-medium text-slate-900">Items</p>
              <p>{order.itemCount} packed items</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Wallet className="mt-0.5 h-4 w-4 text-orange-500" />
            <div>
              <p className="font-medium text-slate-900">Payment</p>
              <p>{order.paymentMode === 'prepaid' ? 'Prepaid' : 'Cash on delivery'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50/80 px-4 py-3 text-sm text-slate-700">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-orange-500" />
            <div>
              <p className="font-medium text-slate-900">Drop-off address</p>
              <p className="mt-1">{order.dropoffAddress}</p>
            </div>
          </div>
          {order.notes ? <p className="mt-3 text-xs text-slate-500">{order.notes}</p> : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Ordered {order.orderedAtLabel}
          </p>
          <Link
            href={`/orders/${order.id}`}
            className={cn(
              'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition',
              'bg-slate-900 text-white hover:bg-slate-800'
            )}
          >
            Open order detail
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
