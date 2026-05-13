"use client";

import { useEffect, useRef } from "react";

export function useOrderSound(orders: { id: string; status: string }[]) {
  const playedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const pending = orders.filter((o) => o.status === "pending" && !playedRef.current.has(o.id));
    if (pending.length > 0) {
      // Simple beep using Web Audio API
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } catch {
        // Audio not supported
      }
      pending.forEach((o) => playedRef.current.add(o.id));
    }
  }, [orders]);
}
