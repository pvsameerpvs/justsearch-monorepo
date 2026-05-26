import { SettingsDeliveryCard } from "./settings-delivery-card";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

interface Props {
  restaurant: AdminRestaurant;
  onUpdate: (updates: Partial<AdminRestaurant>) => void;
}

export function SettingsTabOperations({ restaurant, onUpdate }: Props) {
  return (
    <div className="max-w-4xl">
      <SettingsDeliveryCard restaurant={restaurant} onUpdate={onUpdate} />
    </div>
  );
}
