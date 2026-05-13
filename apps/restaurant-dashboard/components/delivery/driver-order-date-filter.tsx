import type { DriverDateFilter } from "./use-driver-order-filter";

const FILTERS: { value: DriverDateFilter; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "This Month" },
  { value: "all", label: "Lifetime" },
];

interface DriverOrderDateFilterProps {
  activeFilter: DriverDateFilter;
  onFilterChange: (filter: DriverDateFilter) => void;
}

export function DriverOrderDateFilter({ activeFilter, onFilterChange }: DriverOrderDateFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
            activeFilter === f.value
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
