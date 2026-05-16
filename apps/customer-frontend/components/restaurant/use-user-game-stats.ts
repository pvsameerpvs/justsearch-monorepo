'use client';

import { useCallback, useEffect, useState } from 'react';

export type GameStat = {
  highScore: number;
  lastScore: number;
  lastPoints: number;
  totalPoints: number;
  maxLevel: number;
  roundsPlayed: number;
  lastPlayed: string;
};

type GameStatsMap = Record<string, GameStat>;

const STORAGE_KEY = 'justsearch:gameStats';
const EMPTY_GAME_STAT: GameStat = {
  highScore: 0,
  lastScore: 0,
  lastPoints: 0,
  totalPoints: 0,
  maxLevel: 1,
  roundsPlayed: 0,
  lastPlayed: '',
};

function readStoredStats(): GameStatsMap {
  if (typeof window === 'undefined') return {};
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function writeStoredStats(stats: GameStatsMap) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function useUserGameStats() {
  const [gameStats, setGameStats] = useState<GameStatsMap>({});

  useEffect(() => {
    setGameStats(readStoredStats());
  }, []);

  const updateGameStat = useCallback((gameId: string, score: number, points: number, level: number = 1) => {
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
  }, []);

  const getGameStat = useCallback((gameId: string) => {
    return { ...EMPTY_GAME_STAT, ...gameStats[gameId] };
  }, [gameStats]);

  return { gameStats, updateGameStat, getGameStat };
}
