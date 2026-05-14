"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface RestaurantSearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onFilterClick?: () => void;
}

export function RestaurantSearchBar({ query, onQueryChange, onFilterClick }: RestaurantSearchBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name, city, cuisine..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
      </div>
      {onFilterClick && (
        <button
          onClick={onFilterClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-slate-300 hover:text-slate-700 transition-all"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
