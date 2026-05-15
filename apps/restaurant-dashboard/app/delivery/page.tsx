import type { Metadata } from 'next';
import { PageHeader } from '@justsearch/ui';
import { DeliveryBoyManager } from '@/components/delivery/delivery-boy-manager';

export const metadata: Metadata = {
  title: 'Delivery | Restaurant Dashboard',
  description: 'Manage delivery agents',
};

export default function DeliveryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Delivery" description="Manage delivery agents" />
      <DeliveryBoyManager />
    </div>
  );
}
