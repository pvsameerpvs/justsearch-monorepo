"use client";

import { LayoutList, LayoutGrid } from "lucide-react";

interface ViewToggleProps {
  view: "list" | "grid";
  onChange: (view: "list" | "grid") => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
      <button
        onClick={() => onChange("list")}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
          view === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <LayoutList className="h-3.5 w-3.5" /> List
      </button>
      <button
        onClick={() => onChange("grid")}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
          view === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <LayoutGrid className="h-3.5 w-3.5" /> Grid
      </button>
    </div>
  );
}
