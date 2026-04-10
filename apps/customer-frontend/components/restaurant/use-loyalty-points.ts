"use client";

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'justsearch:loyaltyPoints';
const DEFAULT_POINTS = 1250;

function parsePoints(value: string | null) {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.max(0, Math.floor(parsed));
}

function readStoredPoints() {
  if (typeof window === 'undefined') return DEFAULT_POINTS;

  try {
    const stored = parsePoints(window.localStorage.getItem(STORAGE_KEY));
    if (stored === null) return DEFAULT_POINTS;
    return stored;
  } catch {
    return DEFAULT_POINTS;
  }
}

function writeStoredPoints(value: number) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, String(Math.max(0, Math.floor(value))));
  } catch {
    // ignore
  }
}

export function useLoyaltyPoints() {
  const [points, setPointsState] = useState<number>(DEFAULT_POINTS);

  useEffect(() => {
    const initial = readStoredPoints();
    setPointsState(initial);
    writeStoredPoints(initial);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next = parsePoints(event.newValue);
      if (next === null) return;
      setPointsState(next);
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
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

