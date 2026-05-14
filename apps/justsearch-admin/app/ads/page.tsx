import { PageHeader } from "@justsearch/ui";
import { AdCampaignContainer } from "@/components/ads";

export default function AdsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ad Campaigns"
        description="Manage advertisement campaigns for restaurants and platform"
      />
      <AdCampaignContainer />
    </div>
  );
}
