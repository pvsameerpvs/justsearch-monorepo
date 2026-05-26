"use client";

import { useState, useEffect, useCallback } from "react";
import {
  readPushSettings,
  writePushSettings,
  urlBase64ToUint8Array,
} from "@/lib/push/push-utils";
import {
  getPushSubscription,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/push/push-subscription";
import {
  storePushSubscription,
  clearStoredPushSubscription,
} from "@/lib/push/push-storage";
import {
  syncPushSubscriptionToBackend,
  removePushSubscriptionFromBackend,
} from "@/lib/push/push-backend-sync";

const VAPID_KEY =
  "BEl62iTMgUf-l1KD0RKyG5A3L8p0GJ5K3R8m2Q9P3N4O5L6K7J8I9H0G1F2E3D4C5B6A7S8D9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0";

function hasNotificationApi(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

function getNotificationPermission(): string {
  if (!hasNotificationApi()) return "default";
  try {
    return Notification.permission;
  } catch {
    return "default";
  }
}

async function requestNotificationPermission(): Promise<string> {
  if (!hasNotificationApi()) return "denied";
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<string>("default");
  const [supported, setSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced" | "failed">("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasSupport =
      "serviceWorker" in navigator && "PushManager" in window && hasNotificationApi();
    setSupported(hasSupport);
    setPermission(getNotificationPermission());
    setPushEnabled(readPushSettings().pushEnabled);
  }, []);

  const checkSub = useCallback(async () => {
    if (!supported) return false;
    const sub = await getPushSubscription();
    setSubscribed(!!sub);
    if (sub) storePushSubscription(sub);
    return !!sub;
  }, [supported]);

  useEffect(() => {
    checkSub();
  }, [checkSub]);

  const togglePush = useCallback(async () => {
    const next = !pushEnabled;

    if (!next) {
      const sub = await getPushSubscription();
      if (sub) {
        await unsubscribeFromPush();
        await removePushSubscriptionFromBackend(sub.endpoint);
      }
      clearStoredPushSubscription();
      setSubscribed(false);
      setPushEnabled(false);
      setSyncStatus("idle");
      writePushSettings({ pushEnabled: false });
      return { success: true };
    }

    const perm =
      permission === "granted" ? "granted" : await requestNotificationPermission();
    setPermission(perm);
    if (perm !== "granted") {
      setPushEnabled(false);
      writePushSettings({ pushEnabled: false });
      return { success: false, error: "Permission denied" };
    }

    try {
      setSyncStatus("syncing");
      const sub = await subscribeToPush(
        urlBase64ToUint8Array(VAPID_KEY) as unknown as BufferSource
      );
      setSubscribed(!!sub);
      if (sub) {
        storePushSubscription(sub);
        const sync = await syncPushSubscriptionToBackend(sub);
        setSyncStatus(sync.success ? "synced" : "failed");
        if (!sync.success) {
          console.warn("Push subscription sync failed:", sync.error);
        }
      }
      setPushEnabled(true);
      writePushSettings({ pushEnabled: true });
      return { success: true };
    } catch (err) {
      setPushEnabled(false);
      setSyncStatus("failed");
      writePushSettings({ pushEnabled: false });
      return { success: false, error: err instanceof Error ? err.message : "Subscribe failed" };
    }
  }, [pushEnabled, permission, supported]);

  return {
    supported,
    permission,
    pushEnabled,
    subscribed,
    syncStatus,
    togglePush,
  };
}
