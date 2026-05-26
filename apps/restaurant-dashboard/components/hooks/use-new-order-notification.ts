"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useOrdersQuery } from "@/lib/hooks/use-orders-query";
import { playNotificationSound, stopNotificationSound, resumeAudioContext, isAudioReady } from "@/lib/utils/notification-sound";

const AUTO_DISMISS_MS = 15_000;
const SOUND_DURATION_MS = 10_000;
const FLASH_DURATION_MS = 500;
const MAX_TOASTS = 3;

export interface NewOrderToast {
  id: string;
  code: string;
  customerName: string;
  total: string;
  items?: number;
}

export function useNewOrderNotification() {
  const router = useRouter();
  const pathname = usePathname();
  const { orders } = useOrdersQuery();
  const seenRef = useRef<Set<string>>(new Set());
  const [toasts, setToasts] = useState<NewOrderToast[]>([]);
  const [flash, setFlash] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const dismissTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    const check = () => setSoundEnabled(isAudioReady());
    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pending = orders.filter((o) => o.status === "pending" && !seenRef.current.has(o.id));
    if (pending.length === 0) return;

    resumeAudioContext().then(() => {
      playNotificationSound();
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), SOUND_DURATION_MS);
    }).catch(() => {});

    setFlash(true);
    setTimeout(() => setFlash(false), FLASH_DURATION_MS);

    const newToasts = pending.map((o) => ({
      id: o.id,
      code: o.code,
      customerName: o.customerName || "Guest",
      total: o.total,
      items: o.items,
    }));

    setToasts((prev) => [...newToasts, ...prev].slice(0, MAX_TOASTS));
    pending.forEach((o) => seenRef.current.add(o.id));

    newToasts.forEach((toast) => {
      const timer = setTimeout(() => dismissToast(toast.id), AUTO_DISMISS_MS);
      dismissTimers.current.set(toast.id, timer);
    });
  }, [orders]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (next.length === 0) {
        stopNotificationSound();
        setIsPlaying(false);
      }
      return next;
    });
    const timer = dismissTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      dismissTimers.current.delete(id);
    }
  }, []);

  const handleNavigate = useCallback(() => {
    if (pathname !== "/orders") router.push("/orders");
    stopNotificationSound();
    setIsPlaying(false);
    setToasts([]);
    dismissTimers.current.forEach((timer) => clearTimeout(timer));
    dismissTimers.current.clear();
  }, [router, pathname]);

  const enableSound = useCallback(() => {
    resumeAudioContext().then(() => {
      setSoundEnabled(true);
      playNotificationSound();
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), SOUND_DURATION_MS);
    }).catch(() => {});
  }, []);

  const handleStopSound = useCallback(() => {
    stopNotificationSound();
    setIsPlaying(false);
  }, []);

  return {
    toasts,
    flash,
    soundEnabled,
    isPlaying,
    hasToasts: toasts.length > 0,
    onNavigate: handleNavigate,
    onDismiss: dismissToast,
    onEnableSound: enableSound,
    onStopSound: handleStopSound,
  };
}
