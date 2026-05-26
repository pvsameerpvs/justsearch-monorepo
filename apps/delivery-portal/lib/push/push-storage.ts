const SUBSCRIPTION_KEY = "driver-push-subscription-v1";

export function storePushSubscription(sub: PushSubscription | null) {
  if (typeof window === "undefined") return;
  try {
    if (!sub) {
      localStorage.removeItem(SUBSCRIPTION_KEY);
      return;
    }
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(sub.toJSON()));
  } catch {
    // ignore
  }
}

export function getStoredPushSubscription(): PushSubscriptionJSON | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SUBSCRIPTION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PushSubscriptionJSON;
  } catch {
    return null;
  }
}

export function clearStoredPushSubscription() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SUBSCRIPTION_KEY);
  } catch {
    // ignore
  }
}
