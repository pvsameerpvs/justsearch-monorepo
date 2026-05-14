import { Pencil, Trash2 } from "lucide-react";

interface AdCampaignRowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function AdCampaignRowActions({ onEdit, onDelete }: AdCampaignRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button onClick={onEdit} className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-indigo-50 hover:text-indigo-600">
        <Pencil className="h-3 w-3" />
      </button>
      <button onClick={onDelete} className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500">
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}
