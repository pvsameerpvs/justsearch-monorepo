export interface ScoringConfig {
  basePoints: number;
  exponent: number;
  multiplier: number;
  maxPerPlay: number;
  scoringVersion: string;
}

export type AdminGame = {
  id: string;
  name: string;
  description: string;
  localGameId: string;
  icon: string;
  coverImageUrl?: string;
  prize: string;
  maxPoints: number;
  isActive: boolean;
  tag: string;
  sponsorAd: boolean;
  scoringConfig?: ScoringConfig;
};
