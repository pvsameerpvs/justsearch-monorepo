"use client";

import { useState, useEffect, useCallback } from "react";
import { readPushSettings, writePushSettings } from "@/lib/push/push-utils";
import { getPushSubscription } from "@/lib/push/push-subscription";
import { storePushSubscription } from "@/lib/push/push-storage";
import { disablePushNotifications, enablePushNotifications } from "@/lib/push/push-actions";
import { getNotificationPermission, getVapidPublicKey, supportsPushNotifications } from "@/lib/push/push-capability";
import type { PushActionResult, PushSyncStatus } from "@/lib/push/push-types";

const PUSH_CONFIG_ERROR = "Closed-app push is not configured. Open-app realtime alerts still work.";
export function usePushNotifications() {
  const [permission, setPermission] = useState<string>("default");
  const [supported, setSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [syncStatus, setSyncStatus] = useState<PushSyncStatus>("idle");
  const [isToggling, setIsToggling] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const applyResult = useCallback((result: PushActionResult) => {
    if (result.permission) setPermission(result.permission);
    setSubscribed(result.subscribed);
    setPushEnabled(result.pushEnabled);
    setSyncStatus(result.syncStatus);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSupported(supportsPushNotifications());
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
      if (pushEnabled) {
        const result = await disablePushNotifications();
        applyResult(result);
        return { success: true };
      }

      const vapidPublicKey = getVapidPublicKey();
      if (!vapidPublicKey) {
        setLastError(PUSH_CONFIG_ERROR); setPushEnabled(false); setSyncStatus("failed");
        return { success: false, error: PUSH_CONFIG_ERROR };
      }

      setSyncStatus("syncing");
      const result = await enablePushNotifications(vapidPublicKey);
      applyResult(result);
      if (!result.success) setLastError(result.error || "Push setup failed.");
      return { success: result.success, error: result.error };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Subscribe failed";
      setLastError(msg); setPushEnabled(false); setSyncStatus("failed");
      writePushSettings({ pushEnabled: false });
      return { success: false, error: msg };
    } finally {
      setIsToggling(false);
    }
  }, [applyResult, pushEnabled]);

  return { supported, permission, pushEnabled, subscribed, syncStatus, isToggling, lastError, togglePush };
}
