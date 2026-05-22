"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient, ApiError } from '@/lib/api/client';
import {
  readStoredPoints,
  writeStoredPoints,
  STORAGE_KEY,
  UPDATED_EVENT,
  DEFAULT_POINTS,
} from './loyalty-storage';

const REFRESH_INTERVAL_MS = 10_000;

export function useLoyaltyPoints() {
  const [points, setPointsState] = useState<number>(DEFAULT_POINTS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const syncFromServer = useCallback(async () => {
    try {
      const data = await apiClient<{ points: number }>('/games/sessions/total-points');
      const remote = Math.max(0, Math.floor(data.points));
      setPointsState(remote);
      writeStoredPoints(remote);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        throw error; // let global auth handler manage silent refresh
      }
      // Network and other errors stay silent — do NOT reset local points.
    }
  }, []);

  useEffect(() => {
    const initial = readStoredPoints();
    setPointsState(initial);
    syncFromServer();
  }, [syncFromServer]);

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

  useEffect(() => {
    const startInterval = () => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        if (document.visibilityState === 'visible') {
          syncFromServer();
        }
      }, REFRESH_INTERVAL_MS);
    };
    const stopInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    startInterval();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncFromServer();
        startInterval();
      } else {
        stopInterval();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stopInterval();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [syncFromServer]);

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

  const resetPoints = useCallback(
    (value: number = DEFAULT_POINTS) => {
      setPoints(value);
    },
    [setPoints]
  );

  const refresh = useCallback(() => {
    return syncFromServer();
  }, [syncFromServer]);

  return { points, setPoints, addPoints, resetPoints, refresh };
}
