import { PageHeader } from "@justsearch/ui";
import { AdCampaignManager } from "@/components/ads";

export default function AdsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ad Campaigns"
        description="Manage advertisement campaigns for restaurants and platform"
      />
      <AdCampaignManager />
    </div>
  );
}
