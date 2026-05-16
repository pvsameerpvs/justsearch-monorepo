"use client";

import { X } from "lucide-react";
import { useItemEditorForm, useItemEditorSubmit, useEscKey } from "./item-editor-hooks";
import { ItemFormFields } from "./item-form-fields";
import type { MenuItem } from "@/lib/stores/menu-store";

export function ItemEditorModal({
  categoryId,
  item,
  menuId,
  onClose,
}: {
  categoryId: string;
  item?: MenuItem;
  menuId?: string;
  onClose: () => void;
}) {
  const form = useItemEditorForm(item);
  const onSubmit = useItemEditorSubmit({ item, categoryId, menuId, onClose });
  useEscKey(onClose);

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900">{item ? "Edit Item" : "Add Item"}</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <ItemFormFields form={form} />
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={onClose} className="elegant-btn-secondary flex-1">Cancel</button>
            <button type="submit" className="elegant-btn-primary flex-1">{item ? "Update" : "Add"} Item</button>
          </div>
        </form>
      </div>
    </div>
  );
}
