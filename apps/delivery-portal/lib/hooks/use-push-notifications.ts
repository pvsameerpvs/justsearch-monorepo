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

const VAPID_KEY =
  "BEl62iTMgUf-l1KD0RKyG5A3L8p0GJ5K3R8m2Q9P3N4O5L6K7J8I9H0G1F2E3D4C5B6A7S8D9F0G1H2I3J4K5L6M7N8O9P0Q1R2S3T4U5V6W7X8Y9Z0";

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [supported, setSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSupported("serviceWorker" in navigator && "PushManager" in window);
    setPermission(Notification.permission);
    setPushEnabled(readPushSettings().pushEnabled);
  }, []);

  const checkSub = useCallback(async () => {
    if (!supported) return false;
    const sub = await getPushSubscription();
    setSubscribed(!!sub);
    return !!sub;
  }, [supported]);

  useEffect(() => {
    checkSub();
  }, [checkSub]);

  const togglePush = useCallback(async () => {
    const next = !pushEnabled;

    if (!next) {
      await unsubscribeFromPush();
      setSubscribed(false);
      setPushEnabled(false);
      writePushSettings({ pushEnabled: false });
      return { success: true };
    }

    const perm = permission === "granted" ? "granted" : await Notification.requestPermission();
    setPermission(perm);
    if (perm !== "granted") {
      setPushEnabled(false);
      writePushSettings({ pushEnabled: false });
      return { success: false, error: "Permission denied" };
    }

    try {
      const sub = await subscribeToPush(
        urlBase64ToUint8Array(VAPID_KEY) as unknown as BufferSource
      );
      setSubscribed(!!sub);
      setPushEnabled(true);
      writePushSettings({ pushEnabled: true });
      return { success: true };
    } catch (err) {
      setPushEnabled(false);
      writePushSettings({ pushEnabled: false });
      return { success: false, error: err instanceof Error ? err.message : "Subscribe failed" };
    }
  }, [pushEnabled, permission, supported]);

  return { supported, permission, pushEnabled, subscribed, togglePush };
}
