import { Plus, Filter } from "lucide-react";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
  { value: "expired", label: "Expired" },
  { value: "depleted", label: "Depleted" },
];

interface VoucherHeaderProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  onAdd: () => void;
}

export function VoucherHeader({ filter, onFilterChange, onAdd }: VoucherHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 text-slate-400 shrink-0" />
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              filter === f.value
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <button
        onClick={onAdd}
        className="elegant-btn-primary flex items-center justify-center gap-2 shrink-0"
      >
        <Plus className="h-4 w-4" />
        Create Voucher
      </button>
    </div>
  );
}
