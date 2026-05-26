import { apiClient } from "@/lib/api-client";

export async function syncPushSubscriptionToBackend(sub: PushSubscription) {
  try {
    const payload = sub.toJSON();
    await apiClient("/push/subscribe", {
      method: "POST",
      body: JSON.stringify({
        endpoint: payload.endpoint,
        p256dh: payload.keys?.p256dh,
        auth: payload.keys?.auth,
      }),
    });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to sync subscription",
    };
  }
}

export async function removePushSubscriptionFromBackend(endpoint: string) {
  try {
    await apiClient("/push/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ endpoint }),
    });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to remove subscription",
    };
  }
}
