"use client";

import { useDriverAuth } from "@/lib/driver-auth-store";
import { useDriverSettings } from "@/lib/hooks/use-driver-settings";
import { usePwaInstall } from "@/lib/hooks/use-pwa-install";
import { usePushNotifications } from "@/lib/hooks/use-push-notifications";
import { DriverSettingsPresenter } from "./driver-settings-presenter";

interface DriverSettingsContainerProps {
  restaurantName: string;
  restaurantZone: string;
  restaurantLogoUrl?: string;
}

export function DriverSettingsContainer({ restaurantName, restaurantZone, restaurantLogoUrl }: DriverSettingsContainerProps) {
  const { driverName, logout } = useDriverAuth();
  const { settings, hydrated, toggleSound, toggleVibration, setVolume } = useDriverSettings();
  const { canInstall, isInstalled, install } = usePwaInstall();
  const { supported, permission, pushEnabled, syncStatus, togglePush } = usePushNotifications();

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
      volumeLevel={settings.volumeLevel}
      onToggleSound={toggleSound}
      onToggleVibration={toggleVibration}
      onVolumeChange={setVolume}
      onLogout={logout}
      canInstall={canInstall}
      isInstalled={isInstalled}
      onInstall={install}
      pushSupported={supported}
      pushPermission={permission}
      pushEnabled={pushEnabled}
      pushSyncStatus={syncStatus}
      onTogglePush={togglePush}
    />
  );
}
