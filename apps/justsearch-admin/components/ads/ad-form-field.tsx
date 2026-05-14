"use client";

interface AdFormFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}

export function AdFormField({ label, value, onChange, type = "text" }: AdFormFieldProps) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="elegant-input w-full mt-1" />
    </div>
  );
}
