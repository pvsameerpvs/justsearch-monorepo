"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateMenuItemMutation, useUpdateMenuItemMutation } from "@/lib/hooks/use-menu-query";
import { itemEditorSchema, type ItemEditorFormData } from "./item-form-fields";
import type { MenuItem } from "@/lib/stores/menu-store";

export function useItemEditorForm(item?: MenuItem) {
  return useForm<ItemEditorFormData>({
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
}

export function useItemEditorSubmit({
  item,
  categoryId,
  menuId,
  onClose,
}: {
  item?: MenuItem;
  categoryId: string;
  menuId?: string;
  onClose: () => void;
}) {
  const createItem = useCreateMenuItemMutation();
  const updateItem = useUpdateMenuItemMutation();

  return (data: ItemEditorFormData) => {
    const tagList = data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const payload: Record<string, unknown> = {
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.image,
      tags: tagList,
      isAvailable: data.isAvailable,
      categoryId,
    };
    if (!item && menuId) {
      payload.menuId = menuId;
    }
    if (item) {
      updateItem.mutate({ id: item.id, data: payload });
    } else {
      createItem.mutate(payload);
    }
    onClose();
  };
}

export function useEscKey(onClose: () => void) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);
}
