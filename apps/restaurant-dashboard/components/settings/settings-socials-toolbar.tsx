import { Check, Loader2, X } from "lucide-react";

interface Props {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export function SettingsSocialsToolbar({ isEditing, isSaving, onEdit, onCancel, onSave }: Props) {
  if (isEditing) {
    return (
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} disabled={isSaving} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 disabled:opacity-50">
          <X className="h-4 w-4" /> Cancel
        </button>
        <button onClick={onSave} disabled={isSaving} className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <button onClick={onEdit} className="elegant-btn-secondary text-xs">
        Edit Social Links
      </button>
    </div>
  );
}
