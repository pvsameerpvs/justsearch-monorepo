import { PageHeader } from "@justsearch/ui";
import { HomepageEditor } from "@/components/homepage/homepage-editor";
import { getCurrentRestaurant } from "@/lib/get-current-restaurant";

export default async function HomepagePage() {
  const restaurant = await getCurrentRestaurant();
  return (
    <div className="space-y-6">
      <PageHeader title="Homepage Editor" description="Customize your customer-facing homepage" />
      <HomepageEditor restaurant={restaurant} />
    </div>
  );
}
