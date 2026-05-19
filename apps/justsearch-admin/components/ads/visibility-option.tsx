"use client";

import { Eye, EyeOff } from "lucide-react";

interface VisibilityOptionProps {
  label: string;
  fieldKey: string;
  value: Record<string, boolean>;
  onChange: (val: Record<string, boolean>) => void;
}

export function VisibilityOption({ label, fieldKey, value, onChange }: VisibilityOptionProps) {
  const isVisible = value[fieldKey] ?? false;

  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange({ ...value, [fieldKey]: false })}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            !isVisible
              ? "bg-red-50 text-red-700 ring-1 ring-red-200"
              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
          }`}
        >
          <EyeOff className="h-3 w-3" />
          Hide
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...value, [fieldKey]: true })}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            isVisible
              ? "bg-green-50 text-green-700 ring-1 ring-green-200"
              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
          }`}
        >
          <Eye className="h-3 w-3" />
          Show
        </button>
      </div>
    </div>
  );
}
