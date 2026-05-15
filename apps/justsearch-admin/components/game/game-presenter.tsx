import { GameHeader } from './game-header';
import { GameList } from './game-list';
import type { AdminGame } from '@/lib/stores/game-store';

interface GamePresenterProps {
  games: AdminGame[];
  activeCount: number;
  totalCount: number;
  onToggleAvailability: (id: string, isActive: boolean) => void;
}

export function GamePresenter({ games, activeCount, totalCount, onToggleAvailability }: GamePresenterProps) {
  return (
    <div className="space-y-4">
      <GameHeader activeCount={activeCount} totalCount={totalCount} />
      <GameList games={games} onToggleAvailability={onToggleAvailability} />
    </div>
  );
}
