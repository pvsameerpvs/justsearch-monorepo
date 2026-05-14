import type { LucideIcon } from "lucide-react";

interface SettingsInputFieldProps {
  label: string;
  value: string;
  icon: LucideIcon;
  onChange: (v: string) => void;
}

export function SettingsInputField({ label, value, icon: Icon, onChange }: SettingsInputFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">{label}</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pl-9 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
        />
      </div>
    </div>
  );
}
