import { Check } from "lucide-react";
import type { GameOption } from "./ad-campaign.types";

interface AdGameSelectorProps {
  games: GameOption[];
  assignedGames: string[];
  onToggle: (gameId: string) => void;
}

export function AdGameSelector({ games, assignedGames, onToggle }: AdGameSelectorProps) {
  const visible = games.filter((g) => g.isActive || assignedGames.includes(g.id));

  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-slate-700">Assign to Games</label>
      <p className="mb-3 text-xs text-slate-500">Select which games this ad will run on</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {visible.map((g) => {
          const isAssigned = assignedGames.includes(g.id);
          const isDisabled = !g.isActive;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => !isDisabled && onToggle(g.id)}
              disabled={isDisabled}
              className={`relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                isDisabled
                  ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-60"
                  : isAssigned
                    ? "border-indigo-500 bg-indigo-50 shadow-sm ring-1 ring-indigo-200 hover:-translate-y-0.5"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm hover:-translate-y-0.5"
              }`}
            >
              {isAssigned && !isDisabled && (
                <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm">
                  <Check className="h-3 w-3" />
                </div>
              )}
              <span className="text-2xl">{g.icon}</span>
              <span className={`text-[11px] font-bold ${isAssigned && !isDisabled ? "text-indigo-700" : "text-slate-600"}`}>{g.name}</span>
              {isDisabled && (
                <span className="text-[8px] font-bold uppercase tracking-wide text-red-500">Inactive</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
