import { PageHeader } from '@justsearch/ui';
import { OrderManager } from '@/components/orders/order-manager';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Manage incoming orders and assign delivery" />
      <OrderManager />
    </div>
  );
}
