"use client";

import { X, Loader2 } from "lucide-react";
import {
  useItemEditorForm,
  useItemEditorSubmit,
  useEscKey,
} from "./item-editor-hooks";
import { ItemFormFields } from "./item-form-fields";
import type { MenuItem } from "@/lib/stores/menu-store";

type ItemEditorModalProps = {
  categoryId: string;
  item?: MenuItem;
  menuId?: string;
  onClose: () => void;
};

export function ItemEditorModal({
  categoryId,
  item,
  menuId,
  onClose,
}: ItemEditorModalProps) {
  const form = useItemEditorForm(item);
  const { onSubmit, isSaving } = useItemEditorSubmit({
    item,
    categoryId,
    menuId,
    onClose,
  });
  useEscKey(onClose);

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <Header title={item ? "Edit Item" : "Add Item"} onClose={onClose} />
        <form onSubmit={handleSubmit}>
          <ItemFormFields form={form} />
          <Footer
            isSaving={isSaving}
            isEditing={Boolean(item)}
            onCancel={onClose}
          />
        </form>
      </div>
    </div>
  );
}

function Header({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <button
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function Footer({
  isSaving,
  isEditing,
  onCancel,
}: {
  isSaving: boolean;
  isEditing: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="mt-6 flex gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="elegant-btn-secondary flex-1"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSaving}
        className="elegant-btn-primary flex-1"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-1 inline h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          `${isEditing ? "Update" : "Add"} Item`
        )}
      </button>
    </div>
  );
}
