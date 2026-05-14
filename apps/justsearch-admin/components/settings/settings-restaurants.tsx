import { Store, ShieldCheck, Zap } from "lucide-react";
import { SettingsSectionHeader } from "./settings-section-header";
import { SettingsToggleRow } from "./settings-toggle-row";
import type { SettingsStore } from "@/lib/stores/settings-store";

interface SettingsRestaurantsProps {
  settings: SettingsStore;
}

export function SettingsRestaurants({ settings }: SettingsRestaurantsProps) {
  const { restaurantDefaults, updateRestaurantDefaults } = settings;

  return (
    <div className="space-y-5">
      <SettingsSectionHeader icon={Store} title="Restaurant Defaults" description="Applied to new signups" iconBg="bg-blue-100" iconColor="text-blue-600" />
      <SettingsToggleRow
        label="Auto-Activate Restaurants"
        description="Skip manual approval for new signups"
        icon={Zap}
        checked={restaurantDefaults.autoActivate}
        onChange={(v) => updateRestaurantDefaults({ autoActivate: v })}
      />
      <SettingsToggleRow
        label="Require KYC Verification"
        description="Restaurants must submit license and tax documents"
        icon={ShieldCheck}
        checked={restaurantDefaults.requireKYC}
        onChange={(v) => updateRestaurantDefaults({ requireKYC: v })}
      />
    </div>
  );
}
