"use client";

import { useState, useEffect, useCallback } from "react";

const SETTINGS_KEY = "driver-settings-v1";

export interface DriverSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  volumeLevel: number;
}

function readStorage(): DriverSettings {
  if (typeof window === "undefined") {
    return { soundEnabled: true, vibrationEnabled: true, volumeLevel: 100 };
  }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { soundEnabled: true, vibrationEnabled: true, volumeLevel: 100 };
    const parsed = JSON.parse(raw);
    return {
      soundEnabled: parsed.soundEnabled !== false,
      vibrationEnabled: parsed.vibrationEnabled !== false,
      volumeLevel: typeof parsed.volumeLevel === "number" ? Math.max(0, Math.min(100, parsed.volumeLevel)) : 100,
    };
  } catch {
    return { soundEnabled: true, vibrationEnabled: true, volumeLevel: 100 };
  }
}

function writeStorage(settings: DriverSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function useDriverSettings() {
  const [settings, setSettings] = useState<DriverSettings>({ soundEnabled: true, vibrationEnabled: true, volumeLevel: 100 });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(readStorage());
    setHydrated(true);
  }, []);

  const toggleSound = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, soundEnabled: !prev.soundEnabled };
      writeStorage(next);
      return next;
    });
  }, []);

  const toggleVibration = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, vibrationEnabled: !prev.vibrationEnabled };
      writeStorage(next);
      return next;
    });
  }, []);

  const setVolume = useCallback((level: number) => {
    setSettings((prev) => {
      const next = { ...prev, volumeLevel: Math.max(0, Math.min(100, level)) };
      writeStorage(next);
      return next;
    });
  }, []);

  return {
    settings,
    hydrated,
    toggleSound,
    toggleVibration,
    setVolume,
  };
}
