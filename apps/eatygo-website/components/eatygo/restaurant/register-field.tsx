import type { InputHTMLAttributes } from 'react';

interface RegisterFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function RegisterField({ label, ...props }: RegisterFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input
        {...props}
        className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-normal outline-none transition focus:border-lagoon"
      />
    </label>
  );
}
