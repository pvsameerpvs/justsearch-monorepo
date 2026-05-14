import { PageHeader } from '@justsearch/ui';
import { RevenueContainer } from '@/components/revenue';

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Revenue" description="Platform revenue, commissions, and restaurant performance" />
      <RevenueContainer />
    </div>
  );
}
