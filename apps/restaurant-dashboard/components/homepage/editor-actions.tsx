import { RotateCcw, Save } from "lucide-react";

interface EditorActionsProps {
  hasChanges: boolean;
  onReset: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export function EditorActions({ hasChanges, onReset, onSave, isSaving }: EditorActionsProps) {
  return (
    <div className="flex gap-3">
      {hasChanges && (
        <button onClick={onReset} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors flex-1">
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      )}
      <button onClick={onSave} disabled={!hasChanges || isSaving} className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all flex-1 ${hasChanges && !isSaving ? "bg-amber-500 text-white hover:bg-amber-600 shadow-sm shadow-amber-500/20" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
        <Save className="h-4 w-4" /> {isSaving ? "Saving..." : hasChanges ? "Save Changes" : "No Changes"}
      </button>
    </div>
  );
}
