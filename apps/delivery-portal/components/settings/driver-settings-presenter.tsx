"use client";

import { DriverSettingsRestaurantCard } from "./driver-settings-restaurant-card";
import { DriverSettingsProfileCard } from "./driver-settings-profile-card";
import { DriverSettingsNotifications } from "./driver-settings-notifications";
import { DriverVolumeSlider } from "./driver-volume-slider";
import { DriverPushSettings } from "./driver-push-settings";
import { DriverPwaInstallCard } from "./driver-pwa-install-card";
import { DriverSettingsAbout } from "./driver-settings-about";
import { DriverSettingsLogout } from "./driver-settings-logout";

interface Props {
  restaurantName: string;
  restaurantZone: string;
  restaurantLogoUrl?: string;
  driverName: string;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  volumeLevel: number;
  onToggleSound: () => void;
  onToggleVibration: () => void;
  onVolumeChange: (level: number) => void;
  onLogout: () => void;
  canInstall: boolean;
  isInstalled: boolean;
  onInstall: () => Promise<{ outcome: "accepted" | "dismissed" }>;
  pushSupported: boolean;
  pushPermission: string;
  pushEnabled: boolean;
  pushSyncStatus: "idle" | "syncing" | "synced" | "failed";
  onTogglePush: () => Promise<{ success: boolean; error?: string }>;
}

export function DriverSettingsPresenter(props: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Settings</h1>
        <p className="text-xs text-slate-500">Manage your preferences</p>
      </div>

      <DriverSettingsRestaurantCard
        name={props.restaurantName}
        zone={props.restaurantZone}
        logoUrl={props.restaurantLogoUrl}
      />
      <DriverSettingsProfileCard driverName={props.driverName} />
      <DriverPwaInstallCard
        canInstall={props.canInstall}
        isInstalled={props.isInstalled}
        onInstall={props.onInstall}
      />
      <DriverPushSettings
        supported={props.pushSupported}
        permission={props.pushPermission}
        pushEnabled={props.pushEnabled}
        subscribed={props.pushEnabled}
        syncStatus={props.pushSyncStatus}
        onTogglePush={props.onTogglePush}
      />
      <DriverSettingsNotifications
        soundEnabled={props.soundEnabled}
        vibrationEnabled={props.vibrationEnabled}
        onToggleSound={props.onToggleSound}
        onToggleVibration={props.onToggleVibration}
      />
      <DriverVolumeSlider volumeLevel={props.volumeLevel} onChange={props.onVolumeChange} />
      <DriverSettingsAbout />
      <DriverSettingsLogout onLogout={props.onLogout} />
    </div>
  );
}
