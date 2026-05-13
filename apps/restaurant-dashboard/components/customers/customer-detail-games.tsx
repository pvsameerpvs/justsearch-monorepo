import { Gamepad2, Trophy, Clock, Gift } from "lucide-react";
import type { GameActivity } from "./types/customer.types";

interface CustomerDetailGamesProps {
  games: GameActivity[];
}

export function CustomerDetailGames({ games }: CustomerDetailGamesProps) {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Gamepad2 className="h-8 w-8 text-slate-300 mb-3" />
        <p className="text-sm font-bold text-slate-900">No games played</p>
        <p className="text-xs text-slate-400 mt-1">This customer hasn't played any games yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {games.map((game, index) => (
        <div key={index} className="elegant-card p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <Gamepad2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{game.gameName}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <Clock className="h-3 w-3" />
                  {game.playedAt}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                <Trophy className="h-4 w-4" />
                {game.score.toLocaleString()}
              </div>
              {game.reward && (
                <div className="flex items-center gap-1 text-[10px] text-amber-600 mt-0.5">
                  <Gift className="h-3 w-3" />
                  {game.reward}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
