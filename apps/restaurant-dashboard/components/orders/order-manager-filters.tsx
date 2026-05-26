interface OrderManagerFiltersProps {
  filters: readonly string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function OrderManagerFilters({ filters, activeFilter, onFilterChange }: OrderManagerFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => {
        const isActive = activeFilter === f;
        return (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition-all duration-200 ${
              isActive
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/15"
                : "bg-white/80 border border-slate-200/60 text-slate-600 hover:border-slate-300 hover:bg-white hover:shadow-sm backdrop-blur-sm"
            }`}
          >
            {f === "all" ? "All Orders" : f.replace("_", " ")}
          </button>
        );
      })}
    </div>
  );
}
