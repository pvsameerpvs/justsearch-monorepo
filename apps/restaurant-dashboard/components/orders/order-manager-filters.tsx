interface OrderManagerFiltersProps {
  filters: readonly string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function OrderManagerFilters({ filters, activeFilter, onFilterChange }: OrderManagerFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition-all ${
            activeFilter === f
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
          }`}
        >
          {f.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}
