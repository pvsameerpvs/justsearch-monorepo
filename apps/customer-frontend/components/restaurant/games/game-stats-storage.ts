export type GameStat = {
  highScore: number;
  lastScore: number;
  lastPoints: number;
  totalPoints: number;
  maxLevel: number;
  roundsPlayed: number;
  lastPlayed: string;
};

export type GameStatsMap = Record<string, GameStat>;

export const EMPTY_GAME_STAT: GameStat = {
  highScore: 0,
  lastScore: 0,
  lastPoints: 0,
  totalPoints: 0,
  maxLevel: 1,
  roundsPlayed: 0,
  lastPlayed: '',
};

const STORAGE_KEY = 'justsearch:gameStats';
export const UPDATED_EVENT = 'justsearch:gameStatsUpdated';

export function readStoredStats(): GameStatsMap {
  if (typeof window === 'undefined') return {};
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function writeStoredStats(stats: GameStatsMap) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    window.dispatchEvent(new Event(UPDATED_EVENT));
  } catch {
    // ignore
  }
}
