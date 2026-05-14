import { PageHeader } from "@justsearch/ui";
import { DashboardContainer } from "@/components/dashboard";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Platform overview and key metrics"
      />
      <DashboardContainer />
    </div>
  );
}
