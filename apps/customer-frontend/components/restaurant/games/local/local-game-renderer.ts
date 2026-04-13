import type { ReactElement } from 'react';
import type { LocalGame } from '@/lib/restaurant-types';
import type { GameAwardHandler } from '../game-award';

export type LocalGameRendererProps = {
  game: LocalGame;
  onAward: GameAwardHandler;
};

export type LocalGameRenderer = (props: LocalGameRendererProps) => ReactElement;
