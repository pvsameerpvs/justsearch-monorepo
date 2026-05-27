export function hasNotificationApi(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function supportsPushNotifications(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    hasNotificationApi()
  );
}

export function getNotificationPermission(): string {
  if (!hasNotificationApi()) return "default";
  try {
    return Notification.permission;
  } catch {
    return "default";
  }
}

export async function requestNotificationPermission(): Promise<string> {
  if (!hasNotificationApi()) return "denied";
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export function getVapidPublicKey(): string | null {
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
  return key.trim() || null;
}
