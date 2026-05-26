"use client";

import { useEffect, useRef } from "react";
import { playNotificationSound, resumeAudioContext } from "@/lib/utils/notification-sound";

export function useOrderSound(orders: { id: string; status: string }[]) {
  const playedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const pending = orders.filter((o) => o.status === "pending" && !playedRef.current.has(o.id));
    if (pending.length > 0) {
      // Resume audio context first, then play loud sound
      resumeAudioContext().then(() => {
        playNotificationSound();
      }).catch(() => {
        // Audio blocked by browser policy
      });
      pending.forEach((o) => playedRef.current.add(o.id));
    }
  }, [orders]);
}
