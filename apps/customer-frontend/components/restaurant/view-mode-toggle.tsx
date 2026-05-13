import { LayoutGrid, List } from "lucide-react";
import type { ViewMode } from "./restaurant-menu-showcase";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ viewMode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center self-end sm:self-auto">
      <p className="mr-3 hidden text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 sm:block">View</p>
      <div className="inline-flex items-center rounded-2xl bg-slate-100/80 p-1 shadow-inner">
        <button
          onClick={() => onChange('grid')}
          className={`flex h-10 w-12 items-center justify-center rounded-xl transition-all duration-300 active:scale-90 ${
            viewMode === 'grid' ? 'bg-white text-[rgb(var(--brand))] shadow-[0_4px_12px_rgba(0,0,0,0.06)]' : 'text-slate-400 hover:text-slate-500'
          }`}
          aria-label="Grid view"
        >
          <LayoutGrid className={`h-4 w-4 ${viewMode === 'grid' ? 'scale-110' : 'scale-100'}`} />
        </button>
        <div className="h-4 w-px bg-slate-200/60 mx-0.5" />
        <button
          onClick={() => onChange('list')}
          className={`flex h-10 w-12 items-center justify-center rounded-xl transition-all duration-300 active:scale-90 ${
            viewMode === 'list' ? 'bg-white text-[rgb(var(--brand))] shadow-[0_4px_12px_rgba(0,0,0,0.06)]' : 'text-slate-400 hover:text-slate-500'
          }`}
          aria-label="List view"
        >
          <List className={`h-4 w-4 ${viewMode === 'list' ? 'scale-110' : 'scale-100'}`} />
        </button>
      </div>
    </div>
  );
}
