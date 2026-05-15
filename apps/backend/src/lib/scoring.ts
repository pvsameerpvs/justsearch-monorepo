export interface ScoringConfig {
  basePoints: number;
  exponent: number;
  multiplier: number;
  maxPerPlay: number;
  scoringVersion: string;
}

const DEFAULT_SCORING: ScoringConfig = {
  basePoints: 10,
  exponent: 0.7,
  multiplier: 2.5,
  maxPerPlay: 500,
  scoringVersion: 'v1',
};

export function calculatePoints(rawScore: number, config?: Partial<ScoringConfig>): number {
  const cfg = { ...DEFAULT_SCORING, ...config };
  const raw = Math.max(0, rawScore);
  const derived = cfg.basePoints + Math.floor(Math.pow(raw, cfg.exponent) * cfg.multiplier);
  return Math.min(derived, cfg.maxPerPlay);
}

export function extractScoringConfig(dbConfig: Record<string, unknown>): ScoringConfig {
  const scoring = (dbConfig?.scoring as Partial<ScoringConfig>) || {};
  return { ...DEFAULT_SCORING, ...scoring };
}

export const DAILY_HARD_CAP = 2000;
