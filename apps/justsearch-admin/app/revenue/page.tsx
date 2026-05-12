import { PageHeader } from '@justsearch/ui';
import { RevenueDashboard } from '@/components/revenue/revenue-dashboard';

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Revenue" description="Platform revenue and commission tracking" />
      <RevenueDashboard />
    </div>
  );
}
