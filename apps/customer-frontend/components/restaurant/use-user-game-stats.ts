'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import {
  readStoredStats,
  writeStoredStats,
  EMPTY_GAME_STAT,
  UPDATED_EVENT,
  type GameStat,
  type GameStatsMap,
} from './games/game-stats-storage';
import { computeStats } from './games/game-stats-compute';

export { type GameStat } from './games/game-stats-storage';

const STORAGE_KEY = 'justsearch:gameStats';
const REFRESH_INTERVAL_MS = 10_000;

export function useUserGameStats() {
  const [gameStats, setGameStats] = useState<GameStatsMap>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const syncFromServer = useCallback(async () => {
    try {
      const data = await apiClient<{ sessions: Parameters<typeof computeStats>[0] }>('/games/sessions/my-stats');
      const computed = computeStats(data.sessions);
      setGameStats(computed);
      writeStoredStats(computed);
    } catch {
      // Auth errors must NOT wipe local stats. Keep existing state.
    }
  }, []);

  useEffect(() => {
    const local = readStoredStats();
    setGameStats(local);
    syncFromServer();
  }, [syncFromServer]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      setGameStats(readStoredStats());
    };
    window.addEventListener('storage', onStorage);
    const onUpdated = () => setGameStats(readStoredStats());
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

  const updateGameStat = useCallback(
    (gameId: string, score: number, points: number, level: number = 1) => {
      setGameStats((current) => {
        const existing = { ...EMPTY_GAME_STAT, ...current[gameId] };
        const updated: GameStat = {
          highScore: Math.max(existing.highScore, score),
          lastScore: score,
          lastPoints: points,
          totalPoints: existing.totalPoints + points,
          maxLevel: Math.max(existing.maxLevel, level),
          roundsPlayed: existing.roundsPlayed + 1,
          lastPlayed: new Date().toISOString(),
        };
        const next = { ...current, [gameId]: updated };
        writeStoredStats(next);
        return next;
      });
    },
    []
  );

  const getGameStat = useCallback(
    (gameId: string) => {
      return { ...EMPTY_GAME_STAT, ...gameStats[gameId] };
    },
    [gameStats]
  );

  const refresh = useCallback(() => {
    return syncFromServer();
  }, [syncFromServer]);

  return { gameStats, updateGameStat, getGameStat, refresh };
}
