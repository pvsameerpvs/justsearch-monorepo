interface SettingsColorFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export function SettingsColorField({ label, value, onChange }: SettingsColorFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-lg border border-slate-200 p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
        />
      </div>
    </div>
  );
}
