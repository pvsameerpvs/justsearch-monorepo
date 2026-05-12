"use client";

import { useCallback, useEffect, useState } from 'react';

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY = 'justsearch:gameCooldowns';

function readCooldowns(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function writeCooldowns(cooldowns: Record<string, number>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cooldowns));
  } catch {
    // ignore
  }
}

export function useGameCooldown() {
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  useEffect(() => {
    setCooldowns(readCooldowns());
  }, []);

  const getCooldownInfo = useCallback((gameId: string) => {
    const lastPlayed = cooldowns[gameId];
    if (!lastPlayed) return { isOnCooldown: false, remainingMs: 0, remainingLabel: '' };

    const now = Date.now();
    const elapsed = now - lastPlayed;
    const remaining = Math.max(0, COOLDOWN_MS - elapsed);

    if (remaining <= 0) return { isOnCooldown: false, remainingMs: 0, remainingLabel: '' };

    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    const label = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    return { isOnCooldown: true, remainingMs: remaining, remainingLabel: label };
  }, [cooldowns]);

  const markPlayed = useCallback((gameId: string) => {
    setCooldowns((current) => {
      const next = { ...current, [gameId]: Date.now() };
      writeCooldowns(next);
      return next;
    });
  }, []);

  const resetCooldown = useCallback((gameId: string) => {
    setCooldowns((current) => {
      const next = { ...current };
      delete next[gameId];
      writeCooldowns(next);
      return next;
    });
  }, []);

  return { getCooldownInfo, markPlayed, resetCooldown };
}
