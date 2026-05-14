import { Pencil, Trash2 } from "lucide-react";

interface AdCampaignRowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function AdCampaignRowActions({ onEdit, onDelete }: AdCampaignRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={onEdit}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        title="Edit"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={onDelete}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        title="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
