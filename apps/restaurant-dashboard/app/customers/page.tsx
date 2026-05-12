import { PageHeader } from '@justsearch/ui';
import { CustomerInsights } from '@/components/customers/customer-insights';

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Customer insights and data" />
      <CustomerInsights />
    </div>
  );
}
