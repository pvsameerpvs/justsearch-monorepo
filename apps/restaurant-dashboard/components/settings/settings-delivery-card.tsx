"use client";

import { useState, useEffect } from "react";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";
import { UAE_EMIRATES } from "@justsearch/types";
import type { DeliveryConfig } from "@justsearch/types";
import { SettingsDeliveryForm } from "./settings-delivery-form";
import { SettingsDeliveryCardView } from "./settings-delivery-card-view";
import { SettingsDeliveryCardHeader } from "./settings-delivery-card-header";

interface Props {
  restaurant: AdminRestaurant;
  onUpdate?: (updates: Partial<AdminRestaurant>) => void;
}

function buildDefaultConfig(): DeliveryConfig {
  return {
    enabled: false,
    maxRadiusKm: 3,
    restaurantLat: 0,
    restaurantLng: 0,
    emirates: [...UAE_EMIRATES],
    tiers: [{ minKm: 0, maxKm: 1, fee: 5 }],
  };
}

export function SettingsDeliveryCard({ restaurant, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState<DeliveryConfig>(restaurant.delivery ?? buildDefaultConfig());
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync local config when restaurant data updates after a successful save
  useEffect(() => {
    if (!isEditing) {
      setConfig(restaurant.delivery ?? buildDefaultConfig());
    }
  }, [restaurant.delivery, isEditing]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await onUpdate?.({ delivery: config });
      setIsEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save delivery settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="elegant-card p-5">
      <SettingsDeliveryCardHeader
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={() => { setSaveError(null); setIsEditing(true); }}
        onCancel={() => setIsEditing(false)}
        onSave={handleSave}
      />
      {saveError && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">
          {saveError}
        </div>
      )}
      {isEditing ? (
        <SettingsDeliveryForm config={config} onChange={setConfig} />
      ) : (
        <SettingsDeliveryCardView delivery={restaurant.delivery} />
      )}
    </div>
  );
}
