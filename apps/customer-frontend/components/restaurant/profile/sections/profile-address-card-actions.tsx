"use client";

import { Trash2, Pencil } from "lucide-react";

interface ProfileAddressCardActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ProfileAddressCardActions({ onEdit, onDelete }: ProfileAddressCardActionsProps) {
  return (
    <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
      <button
        onClick={onEdit}
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[rgb(var(--brand))] transition-colors hover:bg-[rgb(var(--brand-soft)/0.2)]"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-red-500 transition-colors hover:bg-red-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Remove
      </button>
    </div>
  );
}
