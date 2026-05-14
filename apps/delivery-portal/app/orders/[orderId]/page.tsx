import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Badge, Button, PageHeader } from '@justsearch/ui';
import { DeliveryOrderDetail } from '@/components/orders/delivery-order-detail';
import { DeliveryPortalShell } from '@/components/layout/delivery-portal-shell';
import { getCurrentDeliveryPortalSnapshot } from '@/lib/portal-context';
import { getDeliveryOrderById } from '@/lib/mock-delivery-data';

export default async function DeliveryOrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const snapshot = await getCurrentDeliveryPortalSnapshot();
  const order = getDeliveryOrderById(snapshot.restaurant.slug, params.orderId);

  if (!order) {
    notFound();
  }

  return (
    <DeliveryPortalShell
      restaurant={snapshot.restaurant}
      agent={snapshot.agent}
      routeHealthLabel={snapshot.routeHealthLabel}
    >
      <div className="space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to dispatch queue
        </Link>

        <PageHeader
          title={`Order ${order.code}`}
          description={`Delivery detail for ${snapshot.restaurant.name}.`}
        >
          <Badge variant={order.priority === 'rush' ? 'warning' : 'default'}>
            {order.priority === 'rush' ? 'Rush stop' : 'Standard stop'}
          </Badge>
          <Link href="/">
            <Button size="sm" variant="secondary">
              Open queue
            </Button>
          </Link>
        </PageHeader>

        <DeliveryOrderDetail order={order} />
      </div>
    </DeliveryPortalShell>
  );
}
