import { PageHeader } from '@justsearch/ui';
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Restaurant performance insights" />
      <AnalyticsDashboard />
    </div>
  );
}
