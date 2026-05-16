import { Store } from "lucide-react";
import type { RestaurantOption } from "./ad-campaign.types";

interface AdRestaurantSelectProps {
  value: string | null;
  restaurants: RestaurantOption[];
  onChange: (id: string) => void;
}

export function AdRestaurantSelect({ value, restaurants, onChange }: AdRestaurantSelectProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-700">Restaurant</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Store className="h-4 w-4 text-slate-400" />
        </div>
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
        >
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
    </div>
  );
}
