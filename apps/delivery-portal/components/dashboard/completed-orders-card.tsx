import { Sparkles } from 'lucide-react';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@justsearch/ui';
import type { DeliveryOrder } from '@/lib/delivery-types';

export function CompletedOrdersCard({ orders }: { orders: DeliveryOrder[] }) {
  return (
    <Card className="rounded-3xl border border-orange-100 bg-white/95 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.38)]">
      <CardHeader className="space-y-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Sparkles className="h-5 w-5" />
        </div>
        <CardTitle className="text-xl text-slate-950">Completed this shift</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {orders.map((order) => (
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
  );
}
