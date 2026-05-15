import type { LucideIcon } from "lucide-react";

interface SettingsSelectFieldProps {
  label: string;
  value: string;
  icon: LucideIcon;
  options: string[];
  onChange: (v: string) => void;
  error?: string;
}

export function SettingsSelectField({ label, value, icon: Icon, options, onChange, error }: SettingsSelectFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">{label}</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-4 w-4 text-slate-400" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-xl border bg-white py-2.5 pl-9 pr-8 text-sm text-slate-900 outline-none transition-all focus:ring-2 ${error ? "border-red-300 focus:border-red-400 focus:ring-red-50" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-50"}`}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
