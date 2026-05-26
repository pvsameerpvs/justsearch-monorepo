"use client";

import { NewOrderToastList } from "./new-order-toast-list";
import { useNewOrderNotification } from "./hooks/use-new-order-notification";

export function NewOrderNotification() {
  const {
    toasts,
    flash,
    soundEnabled,
    isPlaying,
    hasToasts,
    onNavigate,
    onDismiss,
    onEnableSound,
    onStopSound,
  } = useNewOrderNotification();

  if (!hasToasts) return null;

  return (
    <NewOrderToastList
      toasts={toasts}
      flash={flash}
      soundEnabled={soundEnabled}
      isPlaying={isPlaying}
      onNavigate={onNavigate}
      onDismiss={onDismiss}
      onEnableSound={onEnableSound}
      onStopSound={onStopSound}
    />
  );
}
