"use client";

import { useCallback, useEffect, useState } from 'react';

type GameStat = {
  highScore: number;
  lastScore: number;
  maxLevel: number;
  roundsPlayed: number;
  lastPlayed: string;
};

type GameStatsMap = Record<string, GameStat>;

const STORAGE_KEY = 'justsearch:gameStats';
const EMPTY_GAME_STAT: GameStat = {
  highScore: 0,
  lastScore: 0,
  maxLevel: 1,
  roundsPlayed: 0,
  lastPlayed: "",
};

function normalizeGameStat(input?: Partial<GameStat>): GameStat {
  return {
    highScore: input?.highScore ?? EMPTY_GAME_STAT.highScore,
    lastScore: input?.lastScore ?? EMPTY_GAME_STAT.lastScore,
    maxLevel: input?.maxLevel ?? EMPTY_GAME_STAT.maxLevel,
    roundsPlayed: input?.roundsPlayed ?? EMPTY_GAME_STAT.roundsPlayed,
    lastPlayed: input?.lastPlayed ?? EMPTY_GAME_STAT.lastPlayed,
  };
}

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

  const updateGameStat = useCallback((gameId: string, score: number, level: number = 1) => {
    setGameStats((current) => {
      const existing = normalizeGameStat(current[gameId]);
      
      const updated: GameStat = {
        highScore: Math.max(existing.highScore, score),
        lastScore: score,
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
    return normalizeGameStat(gameStats[gameId]);
  }, [gameStats]);

  return { gameStats, updateGameStat, getGameStat };
}
