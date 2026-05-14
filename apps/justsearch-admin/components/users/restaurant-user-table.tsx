import { Search, Store } from "lucide-react";
import { RestaurantUserTableRow } from "./restaurant-user-table-row";

interface Row {
  id: string;
  name: string;
  city: string;
  area: string;
  cuisine: string;
  status: "active" | "draft" | "suspended";
  userCount: number;
  totalPoints: number;
}

interface RestaurantUserTableProps {
  rows: Row[];
  search: string;
  onSearch: (v: string) => void;
}

export function RestaurantUserTable({ rows, search, onSearch }: RestaurantUserTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
            <Store className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Restaurants</p>
            <p className="text-xs text-slate-500">{rows.length} total</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search name, city, cuisine..."
            className="text-sm outline-none w-52 bg-transparent placeholder:text-slate-400"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Restaurant</th>
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</th>
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Cuisine</th>
              <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Users</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Points</th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((r) => (
              <RestaurantUserTableRow key={r.id} row={r} />
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <div className="py-10 text-center">
          <p className="text-sm font-bold text-slate-700">No restaurants found</p>
          <p className="text-xs text-slate-500 mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
