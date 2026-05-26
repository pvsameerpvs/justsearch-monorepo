"use client";

import { useDriverAuth } from "@/lib/driver-auth-store";
import { useDriverSettings } from "@/lib/hooks/use-driver-settings";
import { DriverSettingsPresenter } from "./driver-settings-presenter";

interface DriverSettingsContainerProps {
  restaurantName: string;
  restaurantZone: string;
  restaurantLogoUrl?: string;
}

export function DriverSettingsContainer({ restaurantName, restaurantZone, restaurantLogoUrl }: DriverSettingsContainerProps) {
  const { driverName, logout } = useDriverAuth();
  const { settings, hydrated, toggleSound, toggleVibration } = useDriverSettings();

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <DriverSettingsPresenter
      restaurantName={restaurantName}
      restaurantZone={restaurantZone}
      restaurantLogoUrl={restaurantLogoUrl}
      driverName={driverName ?? "Driver"}
      soundEnabled={settings.soundEnabled}
      vibrationEnabled={settings.vibrationEnabled}
      onToggleSound={toggleSound}
      onToggleVibration={toggleVibration}
      onLogout={logout}
    />
  );
}
