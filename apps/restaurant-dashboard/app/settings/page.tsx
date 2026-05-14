import { PageHeader } from "@justsearch/ui";
import { getCurrentRestaurant } from "@/lib/get-current-restaurant";
import { SettingsContainer } from "@/components/settings/settings-container";

export default async function SettingsPage() {
  const restaurant = await getCurrentRestaurant();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Restaurant profile, contact details, and links" />
      <SettingsContainer restaurant={restaurant} />
    </div>
  );
}
