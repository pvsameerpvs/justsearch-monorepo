"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
} from "@/lib/hooks/use-menu-query";
import { uploadImage } from "@/lib/api/upload.api";
import { itemEditorSchema, type ItemEditorFormData } from "./item-form-fields";
import type { MenuItem } from "@/lib/stores/menu-store";

function parseTags(tags?: string): string[] {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

function buildMenuItemPayload(
  data: ItemEditorFormData,
  categoryId: string,
  imageUrl?: string,
) {
  return {
    name: data.name,
    description: data.description,
    price: data.price,
    imageUrl,
    tags: parseTags(data.tags),
    isAvailable: data.isAvailable,
    categoryId,
  };
}

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
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = useCallback(
    async (data: ItemEditorFormData) => {
      setIsSaving(true);
      try {
        const imageUrl = data.image
          ? (await uploadImage(data.image, "menu")).url
          : undefined;
        const payload = buildMenuItemPayload(data, categoryId, imageUrl);
        if (item) {
          await updateItem.mutateAsync({ id: item.id, data: payload });
        } else {
          await createItem.mutateAsync(
            menuId ? { ...payload, menuId } : payload,
          );
        }
        onClose();
      } finally {
        setIsSaving(false);
      }
    },
    [item, categoryId, menuId, createItem, updateItem, onClose],
  );

  return { onSubmit, isSaving };
}

export function useEscKey(onClose: () => void) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
}
