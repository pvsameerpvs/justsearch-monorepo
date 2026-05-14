import { Gamepad2, Trophy, Users } from "lucide-react";

import type { GameStat } from "./types/analytics.types";

interface AnalyticsTopGamesProps {
  gameStats: GameStat[];
}

export function AnalyticsTopGames({ gameStats }: AnalyticsTopGamesProps) {
  const maxPoints = Math.max(...gameStats.map((g) => g.totalPoints), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
          <Gamepad2 className="h-4 w-4 text-purple-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Game Engagement</p>
          <p className="text-xs text-slate-500">Points and active players</p>
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">
        {gameStats.map((g) => {
          const pct = Math.round((g.totalPoints / maxPoints) * 100);
          return (
            <div key={g.gameId}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900">{g.gameName}</span>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{g.players}</span>
                  <span className="flex items-center gap-1 font-bold text-amber-600"><Trophy className="h-3 w-3" />{g.totalPoints.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-purple-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
