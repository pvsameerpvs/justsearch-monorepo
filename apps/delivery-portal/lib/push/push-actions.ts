import { writePushSettings, urlBase64ToUint8Array } from "@/lib/push/push-utils";
import { getNotificationPermission, requestNotificationPermission } from "./push-capability";
import { getPushSubscription, subscribeToPush, unsubscribeFromPush } from "./push-subscription";
import { storePushSubscription, clearStoredPushSubscription } from "./push-storage";
import { removePushSubscriptionFromBackend, syncPushSubscriptionToBackend } from "./push-backend-sync";
import type { PushActionResult } from "./push-types";

const PERMISSION_ERROR = "Permission denied. Enable notifications in iPhone Settings.";
const BACKEND_ERROR = "Closed-app push server sync failed.";

function disabledResult(error?: string, permission?: string): PushActionResult {
  writePushSettings({ pushEnabled: false });
  return { success: false, error, permission, pushEnabled: false, subscribed: false, syncStatus: "failed" };
}

export async function disablePushNotifications(): Promise<PushActionResult> {
  const sub = await getPushSubscription();
  if (sub) {
    await unsubscribeFromPush();
    await removePushSubscriptionFromBackend(sub.endpoint);
  }

  clearStoredPushSubscription();
  writePushSettings({ pushEnabled: false });
  return { success: true, pushEnabled: false, subscribed: false, syncStatus: "idle" };
}

export async function enablePushNotifications(
  vapidPublicKey: string
): Promise<PushActionResult> {
  const currentPerm = getNotificationPermission();
  const permission =
    currentPerm === "granted" ? "granted" : await requestNotificationPermission();

  if (permission !== "granted") {
    return disabledResult(PERMISSION_ERROR, permission);
  }

  const key = urlBase64ToUint8Array(vapidPublicKey);
  const sub = await subscribeToPush(key);

  if (!sub) return disabledResult("Unable to create push subscription.", permission);

  storePushSubscription(sub);
  const sync = await syncPushSubscriptionToBackend(sub);

  if (!sync.success) {
    return disabledResult(`${BACKEND_ERROR} ${sync.error || ""}`.trim(), permission);
  }

  writePushSettings({ pushEnabled: true });
  return { success: true, permission, pushEnabled: true, subscribed: true, syncStatus: "synced" };
}
