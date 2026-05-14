"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface FormFieldProps {
  label: string;
  error?: string;
  icon?: LucideIcon;
  children: ReactNode;
}

export function FormField({ label, error, icon: Icon, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
        {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" />}
        {label}
      </label>
      {children}
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
}

export function FormInput({ label, error, icon: Icon, className = "", ...props }: FormInputProps) {
  return (
    <FormField label={label} error={error} icon={Icon}>
      <input
        {...props}
        className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${className}`}
      />
    </FormField>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
}

export function FormSelect({ label, error, icon: Icon, children, className = "", ...props }: FormSelectProps) {
  return (
    <FormField label={label} error={error} icon={Icon}>
      <select
        {...props}
        className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 appearance-none ${className}`}
      >
        {children}
      </select>
    </FormField>
  );
}
