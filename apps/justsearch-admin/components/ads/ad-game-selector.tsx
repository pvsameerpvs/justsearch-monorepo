import { Check } from "lucide-react";

const DEMO_GAMES = [
  { id: "1", name: "Jump & Bite", icon: "🏃" },
  { id: "2", name: "Hungry Bird Rush", icon: "🐤" },
  { id: "3", name: "Gem Match", icon: "🃏" },
  { id: "4", name: "Cheddar Chase", icon: "🧀" },
  { id: "5", name: "Slice Master", icon: "🍕" },
];

interface AdGameSelectorProps {
  assignedGames: string[];
  onToggle: (gameId: string) => void;
}

export function AdGameSelector({ assignedGames, onToggle }: AdGameSelectorProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-slate-700">Assign to Games</label>
      <p className="mb-3 text-xs text-slate-500">Select which games this ad will run on</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {DEMO_GAMES.map((g) => {
          const active = assignedGames.includes(g.id);
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onToggle(g.id)}
              className={`relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all hover:-translate-y-0.5 ${
                active
                  ? "border-indigo-500 bg-indigo-50 shadow-sm ring-1 ring-indigo-200"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
              }`}
            >
              {active && (
                <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm">
                  <Check className="h-3 w-3" />
                </div>
              )}
              <span className="text-2xl">{g.icon}</span>
              <span className={`text-[11px] font-bold ${active ? "text-indigo-700" : "text-slate-600"}`}>{g.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
