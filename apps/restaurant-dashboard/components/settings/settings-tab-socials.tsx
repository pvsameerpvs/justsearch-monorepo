import { SettingsSocialsCard } from "./settings-socials-card";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface Props {
  restaurant: AdminRestaurant;
  onUpdate: (updates: Partial<AdminRestaurant>) => void;
}

export function SettingsTabSocials({ restaurant, onUpdate }: Props) {
  return (
    <div className="max-w-5xl">
      <SettingsSocialsCard restaurant={restaurant} onUpdate={onUpdate} />
    </div>
  );
}
