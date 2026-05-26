"use client";

import { useState, useCallback } from "react";
import { useRestaurantProfile } from "@/lib/hooks/use-restaurant-profile";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";
import { SettingsTabsNav } from "./settings-tabs-nav";
import type { SettingsTab } from "./settings-tabs-nav";
import { SettingsSkeleton } from "./settings-skeleton";
import { SettingsError } from "./settings-error";
import { SaveToast } from "./settings-save-toast";
import { SettingsTabQr } from "./settings-tab-qr";
import { SettingsTabGeneral } from "./settings-tab-general";
import { SettingsTabBusiness } from "./settings-tab-business";
import { SettingsTabOperations } from "./settings-tab-operations";
import { SettingsTabSocials } from "./settings-tab-socials";

export function SettingsContainer() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("qr");
  const [saved, setSaved] = useState(false);
  const { restaurant, isLoading, error, updateRestaurant } = useRestaurantProfile();

  const handleUpdate = useCallback(
    async (updates: Partial<AdminRestaurant>) => {
      await updateRestaurant(updates);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
    [updateRestaurant]
  );

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  if (isLoading) return <SettingsSkeleton />;
  if (error || !restaurant) return <SettingsError onRetry={handleRetry} />;

  return (
    <div className="relative space-y-6">
      {saved && (
        <div className="fixed right-6 top-24 z-50">
          <SaveToast message="Settings saved successfully" />
        </div>
      )}
      <SettingsTabsNav active={activeTab} onChange={setActiveTab} />
      {activeTab === "qr" && <SettingsTabQr restaurant={restaurant} />}
      {activeTab === "general" && <SettingsTabGeneral restaurant={restaurant} onUpdate={handleUpdate} />}
      {activeTab === "business" && <SettingsTabBusiness restaurant={restaurant} onUpdate={handleUpdate} />}
      {activeTab === "operations" && <SettingsTabOperations restaurant={restaurant} onUpdate={handleUpdate} />}
      {activeTab === "socials" && <SettingsTabSocials restaurant={restaurant} onUpdate={handleUpdate} />}
    </div>
  );
}
