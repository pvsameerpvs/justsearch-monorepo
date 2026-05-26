const PUSH_SETTINGS_KEY = 'driver-push-settings-v1';

interface PushSettings {
  pushEnabled: boolean;
}

export function readPushSettings(): PushSettings {
  if (typeof window === 'undefined') return { pushEnabled: false };
  try {
    const raw = localStorage.getItem(PUSH_SETTINGS_KEY);
    if (!raw) return { pushEnabled: false };
    const parsed = JSON.parse(raw);
    return { pushEnabled: parsed.pushEnabled === true };
  } catch {
    return { pushEnabled: false };
  }
}

export function writePushSettings(settings: PushSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PUSH_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from(rawData.split('').map((c) => c.charCodeAt(0)));
}
