"use client";

import { useEffect, useCallback } from "react";
import { playSiren } from "@/lib/audio/siren";
import { doStrongVibrate } from "@/lib/vibration/delivery-vibration";

interface PushMessage {
  type: "PUSH_RECEIVED" | "PUSH_CLICK";
  title?: string;
  body?: string;
  orderId?: string;
  orderCode?: string;
  vibrate?: number[];
  timestamp?: number;
}

const SETTINGS_KEY = "driver-settings-v1";

function getSettings() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isSoundEnabled(): boolean {
  const s = getSettings();
  return s ? s.soundEnabled !== false : true;
}

function isVibrationEnabled(): boolean {
  const s = getSettings();
  return s ? s.vibrationEnabled !== false : true;
}

function getVolume(): number {
  const s = getSettings();
  return s && typeof s.volumeLevel === "number" ? s.volumeLevel : 100;
}

/**
 * Listens for push messages from the Service Worker.
 * When the app is OPEN/FOREGROUND, system notifications are suppressed.
 * This hook manually plays sound + vibration so the driver is alerted.
 */
export function useForegroundPushAlert() {
  const handleMessage = useCallback((event: MessageEvent) => {
    const data = event.data as PushMessage | undefined;
    if (!data || data.type !== "PUSH_RECEIVED") return;

    // Play sound if enabled
    if (isSoundEnabled()) {
      playSiren(getVolume() / 100);
    }

    // Vibrate if enabled
    if (isVibrationEnabled()) {
      doStrongVibrate();
    }

    // Dispatch a custom event so UI components can show a toast/banner
    window.dispatchEvent(
      new CustomEvent("driver:push-received", {
        detail: {
          title: data.title || "New Delivery",
          body: data.body || "You have a new order assignment",
          orderId: data.orderId,
          orderCode: data.orderCode,
          timestamp: data.timestamp,
        },
      })
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.addEventListener("message", handleMessage);
    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [handleMessage]);
}
