import { Trash2, Eye, EyeOff, Pencil } from "lucide-react";

interface MenuItemActionsProps {
  isAvailable: boolean;
  onEdit?: () => void;
  onToggle: () => void;
  onRemove: () => void;
}

export function MenuItemActions({ isAvailable, onEdit, onToggle, onRemove }: MenuItemActionsProps) {
  return (
    <div className="flex gap-1">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
        }`}
      >
        {isAvailable ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
