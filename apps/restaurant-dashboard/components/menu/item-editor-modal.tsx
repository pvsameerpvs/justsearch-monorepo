"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateMenuItemMutation, useUpdateMenuItemMutation } from "@/lib/hooks/use-menu-query";
import { ItemFormFields, itemEditorSchema, type ItemEditorFormData } from "./item-form-fields";
import type { MenuItem } from "@/lib/stores/menu-store";

export function ItemEditorModal({
  categoryId,
  item,
  onClose,
}: {
  categoryId: string;
  item?: MenuItem;
  onClose: () => void;
}) {
  const createItem = useCreateMenuItemMutation();
  const updateItem = useUpdateMenuItemMutation();
  const form = useForm<ItemEditorFormData>({
    resolver: zodResolver(itemEditorSchema),
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
      price: item?.price ?? 0,
      currency: item?.currency ?? "AED",
      image: item?.image ?? "",
      tags: item?.tags?.join(", ") ?? "",
      subcategory: item?.subcategory ?? "",
      isAvailable: item?.isAvailable ?? true,
    },
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const onSubmit = form.handleSubmit((data) => {
    const tagList = data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const payload = { ...data, categoryId, tags: tagList };
    if (item) {
      updateItem.mutate({ id: item.id, data: payload });
    } else {
      createItem.mutate(payload);
    }
    onClose();
  });

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
        <form onSubmit={onSubmit}>
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
