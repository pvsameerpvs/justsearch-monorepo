import { Search, Users } from "lucide-react";

interface CustomerTableHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  total: number;
}

export function CustomerTableHeader({ search, onSearchChange, total }: CustomerTableHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, phone, email..."
          className="elegant-input w-full pl-9"
        />
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Users className="h-4 w-4" />
        <span className="font-bold">{total}</span>
        <span>customers</span>
      </div>
    </div>
  );
}
