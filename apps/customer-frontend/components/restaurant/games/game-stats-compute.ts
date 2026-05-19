import { EMPTY_GAME_STAT, type GameStatsMap } from './game-stats-storage';

type BackendSession = {
  gameId: string;
  score: number;
  pointsAwarded: number;
  level: number | null;
  playedAt: string;
};

export function computeStats(sessions: BackendSession[]): GameStatsMap {
  const map: GameStatsMap = {};
  for (const s of sessions) {
    const gid = s.gameId;
    const existing = map[gid] ?? { ...EMPTY_GAME_STAT };
    map[gid] = {
      highScore: Math.max(existing.highScore, s.score),
      lastScore: s.score,
      lastPoints: s.pointsAwarded,
      totalPoints: existing.totalPoints + s.pointsAwarded,
      maxLevel: Math.max(existing.maxLevel, s.level ?? 1),
      roundsPlayed: existing.roundsPlayed + 1,
      lastPlayed: s.playedAt,
    };
  }
  return map;
}
