import { ReactNode } from "react";

export function LoginInput({
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  className = "",
}: {
  icon: ReactNode;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/10 transition-all ${className}`}
      />
    </div>
  );
}
