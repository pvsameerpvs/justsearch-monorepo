import { LucideIcon } from "lucide-react";

interface AdFormFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: LucideIcon;
  placeholder?: string;
  error?: string;
}

export function AdFormField({ label, value, onChange, type = "text", icon: Icon, placeholder, error }: AdFormFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-4 w-4 text-slate-400" />
          </div>
        )}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-2 ${Icon ? "pl-9" : ""} ${error ? "border-red-300 focus:border-red-400 focus:ring-red-50" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-50"}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
