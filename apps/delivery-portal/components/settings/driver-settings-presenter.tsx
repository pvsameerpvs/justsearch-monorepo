"use client";

import { DriverSettingsRestaurantCard } from "./driver-settings-restaurant-card";
import { DriverSettingsProfileCard } from "./driver-settings-profile-card";
import { DriverSettingsNotifications } from "./driver-settings-notifications";
import { DriverSettingsAbout } from "./driver-settings-about";
import { DriverSettingsLogout } from "./driver-settings-logout";

interface DriverSettingsPresenterProps {
  restaurantName: string;
  restaurantZone: string;
  restaurantLogoUrl?: string;
  driverName: string;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  onToggleSound: () => void;
  onToggleVibration: () => void;
  onLogout: () => void;
}

export function DriverSettingsPresenter({
  restaurantName,
  restaurantZone,
  restaurantLogoUrl,
  driverName,
  soundEnabled,
  vibrationEnabled,
  onToggleSound,
  onToggleVibration,
  onLogout,
}: DriverSettingsPresenterProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Settings</h1>
        <p className="text-xs text-slate-500">Manage your preferences</p>
      </div>

      <DriverSettingsRestaurantCard name={restaurantName} zone={restaurantZone} logoUrl={restaurantLogoUrl} />
      <DriverSettingsProfileCard driverName={driverName} />
      <DriverSettingsNotifications
        soundEnabled={soundEnabled}
        vibrationEnabled={vibrationEnabled}
        onToggleSound={onToggleSound}
        onToggleVibration={onToggleVibration}
      />
      <DriverSettingsAbout />
      <DriverSettingsLogout onLogout={onLogout} />
    </div>
  );
}
