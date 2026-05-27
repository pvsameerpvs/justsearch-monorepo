"use client";

import { useRef, useCallback } from "react";
import { playSiren, playBigBell } from "@/lib/audio/siren";
import { doStrongVibrate } from "@/lib/vibration/delivery-vibration";
import { readNotificationSettings } from "@/lib/hooks/use-order-notification.utils";

export function useEnhancedNotification() {
  const alarmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playSirenOnce = useCallback(() => {
    const settings = readNotificationSettings();
    if (!settings.soundEnabled) return;
    playSiren(settings.volumeLevel / 100);
  }, []);

  const playBellOnce = useCallback(() => {
    const settings = readNotificationSettings();
    if (!settings.soundEnabled) return;
    playBigBell(settings.volumeLevel / 100);
  }, []);

  const startPersistentAlarm = useCallback(() => {
    if (alarmIntervalRef.current) return;
    const settings = readNotificationSettings();
    if (!settings.soundEnabled) return;
    playSirenOnce();
    alarmIntervalRef.current = setInterval(() => {
      const latest = readNotificationSettings();
      if (latest.soundEnabled) playSirenOnce();
    }, 1500);
  }, [playSirenOnce]);

  const stopPersistentAlarm = useCallback(() => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  }, []);

  const doVibrate = useCallback(() => {
    const settings = readNotificationSettings();
    if (settings.vibrationEnabled) doStrongVibrate();
  }, []);

  return {
    playSirenOnce,
    playBellOnce,
    startPersistentAlarm,
    stopPersistentAlarm,
    doVibrate,
  };
}
