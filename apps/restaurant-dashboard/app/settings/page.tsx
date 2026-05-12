import { PageHeader } from '@justsearch/ui';
import { SettingsInfoCard } from '@/components/settings/settings-info-card';
import { SettingsBrandingCard } from '@/components/settings/settings-branding-card';
import { SettingsContactCard } from '@/components/settings/settings-contact-card';
import { SettingsHoursCard } from '@/components/settings/settings-hours-card';
import { SettingsSocialsCard } from '@/components/settings/settings-socials-card';
import { getCurrentRestaurant } from '@/lib/get-current-restaurant';

export default async function SettingsPage() {
  const restaurant = await getCurrentRestaurant();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description={`Manage ${restaurant.name} configuration`} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsBrandingCard restaurant={restaurant} />
        <SettingsContactCard restaurant={restaurant} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsInfoCard restaurant={restaurant} />
        <div className="space-y-6">
          <SettingsHoursCard restaurant={restaurant} />
          <SettingsSocialsCard restaurant={restaurant} />
        </div>
      </div>
    </div>
  );
}
