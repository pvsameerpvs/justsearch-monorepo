"use client";

import { useState } from "react";
import { Trash2, Eye, EyeOff, Pencil, Power, PowerOff } from "lucide-react";
import { useUpdateMenuItemMutation, useDeleteMenuItemMutation } from "@/lib/hooks/use-menu-query";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";

interface MenuItemActionsProps {
  itemId: string;
  itemName: string;
  isAvailable: boolean;
  onEdit?: () => void;
}

export function MenuItemActions({ itemId, itemName, isAvailable, onEdit }: MenuItemActionsProps) {
  const updateItem = useUpdateMenuItemMutation();
  const deleteItem = useDeleteMenuItemMutation();
  const [showDelete, setShowDelete] = useState(false);

  const handleToggle = () => {
    updateItem.mutate({ id: itemId, data: { isAvailable: !isAvailable } });
  };

  const handleRemove = () => {
    setShowDelete(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
            title="Edit item"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={handleToggle}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
            isAvailable
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
          title={isAvailable ? "Click to disable item" : "Click to enable item"}
        >
          {isAvailable ? <Power className="h-3.5 w-3.5" /> : <PowerOff className="h-3.5 w-3.5" />}
          {isAvailable ? "Enabled" : "Disabled"}
        </button>

        <button
          type="button"
          onClick={handleRemove}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          title="Delete item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {showDelete && (
        <DeleteConfirmDialog
          title="Delete Menu Item"
          description={`Are you sure you want to delete "${itemName}"? This will permanently remove it from the menu.`}
          onConfirm={() => {
            deleteItem.mutate(itemId);
            setShowDelete(false);
          }}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  );
}
