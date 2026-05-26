"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, BellOff } from "lucide-react";
import { resumeAudioContext, isAudioReady, playNotificationSound } from "@/lib/utils/notification-sound";

const STORAGE_KEY = "justsearch:sound-enabled";

function readPreference(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === null ? true : raw === "true";
  } catch {
    return true;
  }
}

function writePreference(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch {
    // ignore
  }
}

export function SoundToggle() {
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(readPreference());
    const check = () => setReady(isAudioReady());
    check();
    const interval = setInterval(check, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = useCallback(() => {
    const next = !enabled;
    setEnabled(next);
    writePreference(next);

    resumeAudioContext().then(() => {
      setReady(true);
      if (next) {
        playNotificationSound();
      }
    }).catch(() => {});
  }, [enabled]);

  const active = ready && enabled;

  return (
    <button
      onClick={handleToggle}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
        active
          ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
          : "bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 animate-pulse"
      }`}
      title={active ? "Sound ON — click to test" : "Sound OFF — click to enable"}
    >
      {active ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
    </button>
  );
}
