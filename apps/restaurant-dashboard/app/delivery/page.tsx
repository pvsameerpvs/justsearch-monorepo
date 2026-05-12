import { PageHeader } from '@justsearch/ui';
import { DeliveryBoyManager } from '@/components/delivery/delivery-boy-manager';

export default function DeliveryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Delivery" description="Manage delivery agents" />
      <DeliveryBoyManager />
    </div>
  );
}
