import { FolderOpen } from "lucide-react";

export function MenuEmpty() {
  return (
    <div className="flex flex-col items-center gap-3 py-16">
      <FolderOpen className="h-10 w-10 text-slate-300" />
      <p className="text-sm font-semibold text-slate-500">No categories yet</p>
      <p className="text-xs text-slate-400">Add your first category to start building the menu</p>
    </div>
  );
}
