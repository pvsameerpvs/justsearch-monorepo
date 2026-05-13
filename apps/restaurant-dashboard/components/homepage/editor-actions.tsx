import { RotateCcw, Save } from "lucide-react";

interface EditorActionsProps {
  hasChanges: boolean;
  onReset: () => void;
  onSave: () => void;
}

export function EditorActions({ hasChanges, onReset, onSave }: EditorActionsProps) {
  return (
    <div className="flex gap-3">
      {hasChanges && (
        <button onClick={onReset} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors flex-1">
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      )}
      <button onClick={onSave} disabled={!hasChanges} className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all flex-1 ${hasChanges ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
        <Save className="h-4 w-4" /> {hasChanges ? "Save Changes" : "No Changes"}
      </button>
    </div>
  );
}
