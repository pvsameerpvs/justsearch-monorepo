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

// Real VAPID public key — pair with backend private key
const VAPID_KEY =
  "BJP8a37Ss19VkXGu_AzHkpDJMs_ZeG8zTXCf3w0YJ5-uuONop2R0GKHVrm5BrOZa8ENEpWwTIEOdagMEFIDM0RQ";

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
  const [isToggling, setIsToggling] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

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
    setIsToggling(true);
    setLastError(null);

    try {
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

      // Request permission if not already granted
      const currentPerm = getNotificationPermission();
      const perm = currentPerm === "granted" ? "granted" : await requestNotificationPermission();
      setPermission(perm);

      if (perm !== "granted") {
        setLastError(perm === "denied" ? "Permission denied. Enable in Settings > Safari > Notifications." : "Permission not granted");
        setPushEnabled(false);
        writePushSettings({ pushEnabled: false });
        return { success: false, error: "Permission denied" };
      }

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
          setLastError("Server sync failed: " + (sync.error || "Backend not ready"));
        }
      }

      setPushEnabled(true);
      writePushSettings({ pushEnabled: true });
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Subscribe failed";
      setLastError(msg);
      setPushEnabled(false);
      setSyncStatus("failed");
      writePushSettings({ pushEnabled: false });
      return { success: false, error: msg };
    } finally {
      setIsToggling(false);
    }
  }, [pushEnabled, permission, supported]);

  return {
    supported,
    permission,
    pushEnabled,
    subscribed,
    syncStatus,
    isToggling,
    lastError,
    togglePush,
  };
}
