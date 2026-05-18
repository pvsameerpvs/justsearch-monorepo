"use client";

import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';

const STORAGE_KEY = 'justsearch:loyaltyPoints';
const UPDATED_EVENT = 'justsearch:loyaltyPointsUpdated';
const DEFAULT_POINTS = 0;

function readStoredPoints() {
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

function writeStoredPoints(value: number) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, String(Math.max(0, Math.floor(value))));
    window.dispatchEvent(new Event(UPDATED_EVENT));
  } catch {
    // ignore
  }
}

export function useLoyaltyPoints() {
  const [points, setPointsState] = useState<number>(DEFAULT_POINTS);

  useEffect(() => {
    const initial = readStoredPoints();
    setPointsState(initial);

    // Fetch from backend as source of truth
    apiClient<{ points: number }>('/games/sessions/total-points')
      .then((data) => {
        const remote = Math.max(0, Math.floor(data.points));
        setPointsState(remote);
        writeStoredPoints(remote);
      })
      .catch(() => {
        // Fall back to localStorage value already set above
      });
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      setPointsState(readStoredPoints());
    };

    window.addEventListener('storage', onStorage);
    const onUpdated = () => setPointsState(readStoredPoints());

    window.addEventListener(UPDATED_EVENT, onUpdated);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(UPDATED_EVENT, onUpdated);
    };
  }, []);

  const setPoints = useCallback((value: number) => {
    const normalized = Math.max(0, Math.floor(value));
    setPointsState(normalized);
    writeStoredPoints(normalized);
  }, []);

  const addPoints = useCallback((delta: number) => {
    const normalizedDelta = Math.floor(delta);
    setPointsState((current) => {
      const next = Math.max(0, current + normalizedDelta);
      writeStoredPoints(next);
      return next;
    });
  }, []);

  const resetPoints = useCallback((value: number = DEFAULT_POINTS) => {
    setPoints(value);
  }, [setPoints]);

  return { points, setPoints, addPoints, resetPoints };
}
