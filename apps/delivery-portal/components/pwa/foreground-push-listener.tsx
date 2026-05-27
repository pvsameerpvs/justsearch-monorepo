"use client";

import { useForegroundPushAlert } from "@/lib/hooks/use-foreground-push-alert";

/**
 * Invisible component that wires up foreground push notification alerts.
 * When the app is open and a push arrives, this plays sound + vibration
 * because the browser suppresses system notifications when the app is visible.
 */
export function ForegroundPushListener() {
  useForegroundPushAlert();
  return null;
}
