import { FolderOpen } from "lucide-react";

export function MenuEmpty() {
  return (
    <div className="flex flex-col items-center gap-3 py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
        <FolderOpen className="h-6 w-6 text-slate-400" />
      </div>
      <p className="text-sm font-semibold text-slate-600">No categories yet</p>
      <p className="text-xs text-slate-400">Add your first category to start building the menu</p>
    </div>
  );
}
