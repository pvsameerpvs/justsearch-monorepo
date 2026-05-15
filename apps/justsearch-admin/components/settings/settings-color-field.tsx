interface SettingsColorFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

export function SettingsColorField({ label, value, onChange, error }: SettingsColorFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-9 w-9 cursor-pointer rounded-lg border p-0.5 ${error ? "border-red-300" : "border-slate-200"}`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:ring-2 ${error ? "border-red-300 focus:border-red-400 focus:ring-red-50" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-50"}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
