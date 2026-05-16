"use client";

import { useRestaurantProfile } from "@/lib/hooks/use-restaurant-profile";
import { SettingsProfileCard } from "@/components/settings/settings-profile-card";
import { SettingsDomainCard } from "@/components/settings/settings-domain-card";
import { SettingsLicenseCard } from "@/components/settings/settings-license-card";
import { SettingsQrCard } from "@/components/settings/settings-qr-card";
import { SettingsContactCard } from "@/components/settings/settings-contact-card";
import { SettingsSocialsCard } from "@/components/settings/settings-socials-card";

export function SettingsContainer() {
  const { restaurant: profile, updateRestaurant } = useRestaurantProfile();

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsProfileCard restaurant={profile} onUpdate={updateRestaurant} />
        <SettingsDomainCard subdomain={profile.subdomain} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsLicenseCard restaurant={profile} onUpdate={updateRestaurant} />
        <SettingsQrCard subdomain={profile.subdomain} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsContactCard restaurant={profile} onUpdate={updateRestaurant} />
        <SettingsSocialsCard restaurant={profile} onUpdate={updateRestaurant} />
      </div>
    </div>
  );
}
