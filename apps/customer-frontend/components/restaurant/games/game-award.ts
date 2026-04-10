export type GameAwardResult = {
  points: number;
  score: number;
  label: string;
};

export type GameAwardHandler = (result: GameAwardResult) => void;

