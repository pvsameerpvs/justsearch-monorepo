export const STORAGE_KEY = 'justsearch:loyaltyPoints';
export const UPDATED_EVENT = 'justsearch:loyaltyPointsUpdated';
export const DEFAULT_POINTS = 0;

export function readStoredPoints(): number {
  if (typeof window === 'undefined') return DEFAULT_POINTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_POINTS;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return DEFAULT_POINTS;
    return Math.max(0, Math.floor(parsed));
  } catch {
    return DEFAULT_POINTS;
  }
}

export function writeStoredPoints(value: number) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Math.max(0, Math.floor(value))));
    window.dispatchEvent(new Event(UPDATED_EVENT));
  } catch {
    // ignore
  }
}
