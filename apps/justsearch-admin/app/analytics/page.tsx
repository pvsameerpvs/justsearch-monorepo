import { PageHeader } from "@justsearch/ui";
import { AnalyticsContainer } from "@/components/analytics";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Platform-wide performance metrics and insights"
      />
      <AnalyticsContainer />
    </div>
  );
}
