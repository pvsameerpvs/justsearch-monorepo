import type { LucideIcon } from "lucide-react";

interface SettingsToggleRowProps {
  label: string;
  description: string;
  icon: LucideIcon;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function SettingsToggleRow({ label, description, icon: Icon, checked, onChange }: SettingsToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white px-4 py-3 hover:border-slate-200 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${checked ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{label}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-indigo-600" : "bg-slate-200"}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}
