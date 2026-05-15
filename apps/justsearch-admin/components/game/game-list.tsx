import { GameCard } from './game-card';
import { GameEmpty } from './game-empty';
import type { AdminGame } from '@/lib/types/game.types';

interface GameListProps {
  games: AdminGame[];
  onToggleAvailability: (id: string, isActive: boolean) => void;
  onSaveScoring: (id: string, config: Record<string, unknown>) => void;
}

export function GameList({ games, onToggleAvailability, onSaveScoring }: GameListProps) {
  if (games.length === 0) return <GameEmpty />;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          onToggleAvailability={() => onToggleAvailability(game.id, !game.isActive)}
          onSaveScoring={onSaveScoring}
        />
      ))}
    </div>
  );
}
