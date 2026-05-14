import { LayoutGrid, BarChart3, Table2 } from "lucide-react";

const TABS = [
  { key: "table" as const, label: "Manage", icon: Table2 },
  { key: "performance" as const, label: "Performance", icon: BarChart3 },
  { key: "grid" as const, label: "Preview", icon: LayoutGrid },
];

interface AdViewTabsProps {
  viewMode: string;
  onChange: (v: "table" | "grid" | "performance") => void;
}

export function AdViewTabs({ viewMode, onChange }: AdViewTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl bg-slate-100 p-1">
      {TABS.map((t) => {
        const Icon = t.icon;
        const active = viewMode === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
              active
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
