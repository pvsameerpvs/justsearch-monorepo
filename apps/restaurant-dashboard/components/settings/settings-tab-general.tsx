import { SettingsProfileCard } from "./settings-profile-card";
import { SettingsContactCard } from "./settings-contact-card";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface Props {
  restaurant: AdminRestaurant;
  onUpdate: (updates: Partial<AdminRestaurant>) => void;
}

export function SettingsTabGeneral({ restaurant, onUpdate }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SettingsProfileCard restaurant={restaurant} onUpdate={onUpdate} />
      <SettingsContactCard restaurant={restaurant} onUpdate={onUpdate} />
    </div>
  );
}
