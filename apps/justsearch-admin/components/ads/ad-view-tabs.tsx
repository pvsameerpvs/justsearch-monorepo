interface AdViewTab {
  key: "table" | "grid" | "performance";
  label: string;
}

interface AdViewTabsProps {
  viewMode: string;
  onChange: (v: "table" | "grid" | "performance") => void;
}

const TABS: AdViewTab[] = [
  { key: "table", label: "Manage Table" },
  { key: "performance", label: "Performance Metrics" },
  { key: "grid", label: "Grid Preview" },
];

export function AdViewTabs({ viewMode, onChange }: AdViewTabsProps) {
  return (
    <div className="flex items-center gap-2">
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
            viewMode === t.key ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
