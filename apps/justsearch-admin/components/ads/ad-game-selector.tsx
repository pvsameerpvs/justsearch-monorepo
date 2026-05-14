const DEMO_GAMES = [
  { id: "1", name: "Jump & Bite" },
  { id: "2", name: "Hungry Bird Rush" },
  { id: "3", name: "Gem Match" },
  { id: "4", name: "Cheddar Chase" },
  { id: "5", name: "Slice Master" },
];

interface AdGameSelectorProps {
  assignedGames: string[];
  onToggle: (gameId: string) => void;
}

export function AdGameSelector({ assignedGames, onToggle }: AdGameSelectorProps) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assign to Games</label>
      <p className="text-[10px] text-slate-400 mb-2">Select which games this ad will run on</p>
      <div className="grid grid-cols-2 gap-2">
        {DEMO_GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => onToggle(g.id)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-colors ${
              assignedGames.includes(g.id)
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            <div className={`h-2 w-2 rounded-full ${assignedGames.includes(g.id) ? "bg-indigo-500" : "bg-slate-300"}`} />
            {g.name}
          </button>
        ))}
      </div>
    </div>
  );
}
