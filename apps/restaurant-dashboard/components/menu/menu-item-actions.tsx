"use client";

import { Trash2, Eye, EyeOff, Pencil } from "lucide-react";
import { useUpdateMenuItemMutation, useDeleteMenuItemMutation } from "@/lib/hooks/use-menu-query";

interface MenuItemActionsProps {
  itemId: string;
  isAvailable: boolean;
  onEdit?: () => void;
}

export function MenuItemActions({ itemId, isAvailable, onEdit }: MenuItemActionsProps) {
  const updateItem = useUpdateMenuItemMutation();
  const deleteItem = useDeleteMenuItemMutation();

  const handleToggle = () => {
    updateItem.mutate({ id: itemId, data: { isAvailable: !isAvailable } });
  };

  const handleRemove = () => {
    deleteItem.mutate(itemId);
  };

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
        onClick={handleToggle}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
        }`}
      >
        {isAvailable ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>
      <button
        type="button"
        onClick={handleRemove}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
