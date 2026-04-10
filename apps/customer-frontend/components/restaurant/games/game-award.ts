export type GameAwardResult = {
  points: number;
  score: number;
  label: string;
  level?: number;
};

export type GameAwardHandler = (result: GameAwardResult) => void;

