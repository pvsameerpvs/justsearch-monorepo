import { SettingsQrHero } from "./settings-qr-hero";
import { SettingsDomainCard } from "./settings-domain-card";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface Props {
  restaurant: AdminRestaurant;
}

export function SettingsTabQr({ restaurant }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <SettingsQrHero subdomain={restaurant.subdomain} restaurantName={restaurant.name} />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <SettingsDomainCard subdomain={restaurant.subdomain} />
      </div>
    </div>
  );
}
