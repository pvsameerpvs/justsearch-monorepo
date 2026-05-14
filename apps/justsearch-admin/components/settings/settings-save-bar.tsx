"use client";

import { Save, Check } from "lucide-react";

interface SettingsSaveBarProps {
  saved: boolean;
  onSave: () => void;
}

export function SettingsSaveBar({ saved, onSave }: SettingsSaveBarProps) {
  return (
    <div className="flex items-center justify-end gap-3">
      {saved && (
        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
          <Check className="h-3.5 w-3.5" />
          Settings saved
        </span>
      )}
      <button
        onClick={onSave}
        className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
      >
        <Save className="h-3.5 w-3.5" />
        Save Changes
      </button>
    </div>
  );
}
