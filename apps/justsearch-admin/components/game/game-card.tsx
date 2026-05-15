import { ToggleLeft, ToggleRight } from 'lucide-react';
import type { AdminGame } from '@/lib/stores/game-store';

interface GameCardProps {
  game: AdminGame;
  onToggleAvailability: () => void;
}

export function GameCard({ game, onToggleAvailability }: GameCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-xl">
          {game.icon}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-slate-900">{game.name}</p>
          <p className="text-xs text-slate-500">{game.description}</p>
          <p className="mt-1 text-xs font-medium text-amber-600">{game.prize}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${game.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {game.isActive ? 'Active' : 'Inactive'}
        </span>
        <button
          type="button"
          onClick={onToggleAvailability}
          aria-label={game.isActive ? 'Deactivate game' : 'Activate game'}
          className="text-slate-400 transition-colors hover:text-amber-600"
        >
          {game.isActive ? <ToggleRight className="h-6 w-6 text-green-500" /> : <ToggleLeft className="h-6 w-6 text-slate-300" />}
        </button>
      </div>
    </div>
  );
}
