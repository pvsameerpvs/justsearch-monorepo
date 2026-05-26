const STRONG_PATTERN = [600, 100, 600, 100, 600, 100, 800, 200, 400, 100, 400, 100, 800];

export function doStrongVibrate() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(STRONG_PATTERN);
  }
}
