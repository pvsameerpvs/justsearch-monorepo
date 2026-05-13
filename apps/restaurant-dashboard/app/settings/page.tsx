import { PageHeader } from "@justsearch/ui";
import { getCurrentRestaurant } from "@/lib/get-current-restaurant";
import { SettingsContactCard } from "@/components/settings/settings-contact-card";
import { SettingsSocialsCard } from "@/components/settings/settings-socials-card";

export default async function SettingsPage() {
  const restaurant = await getCurrentRestaurant();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Contact details and social links" />

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsContactCard restaurant={restaurant} />
        <SettingsSocialsCard restaurant={restaurant} />
      </div>
    </div>
  );
}
