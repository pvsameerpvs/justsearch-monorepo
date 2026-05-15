import { GameHeader } from './game-header';
import { GameList } from './game-list';
import type { AdminGame } from '@/lib/types/game.types';

interface GamePresenterProps {
  games: AdminGame[];
  activeCount: number;
  totalCount: number;
  onToggleAvailability: (id: string, isActive: boolean) => void;
  onSaveScoring: (id: string, config: Record<string, unknown>) => void;
}

export function GamePresenter({ games, activeCount, totalCount, onToggleAvailability, onSaveScoring }: GamePresenterProps) {
  return (
    <div className="space-y-4">
      <GameHeader activeCount={activeCount} totalCount={totalCount} />
      <GameList games={games} onToggleAvailability={onToggleAvailability} onSaveScoring={onSaveScoring} />
    </div>
  );
}
