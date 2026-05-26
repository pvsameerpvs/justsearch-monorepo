import { SettingsLicenseCard } from "./settings-license-card";
import { SettingsDietaryCard } from "./settings-dietary-card";
import { SettingsTablesCard } from "./settings-tables-card";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface Props {
  restaurant: AdminRestaurant;
  onUpdate: (updates: Partial<AdminRestaurant>) => void;
}

export function SettingsTabBusiness({ restaurant, onUpdate }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SettingsLicenseCard restaurant={restaurant} onUpdate={onUpdate} />
      <div className="space-y-6">
        <SettingsDietaryCard restaurant={restaurant} onUpdate={onUpdate} />
        <SettingsTablesCard restaurant={restaurant} onUpdate={onUpdate} />
      </div>
    </div>
  );
}
