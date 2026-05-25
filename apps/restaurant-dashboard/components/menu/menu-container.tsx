"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@justsearch/ui";
import { ViewToggle } from "@/components/ui/view-toggle";
import { useMenuCategoriesQuery, useMenuItemsQuery } from "@/lib/hooks/use-menu-query";
import { CategoryEditor } from "./category-editor";
import { ItemEditorModal } from "./item-editor-modal";
import { CategoryCreator } from "./category-creator";
import { MenuSkeleton } from "./menu-skeleton";
import { MenuError } from "./menu-error";
import { MenuEmpty } from "./menu-empty";
import type { MenuItem } from "@/lib/stores/menu-store";

export function MenuContainer() {
  const cats = useMenuCategoriesQuery();
  const items = useMenuItemsQuery();
  const [view, setView] = useState<"list" | "grid">("list");
  const menuId = items.data?.items?.[0]?.menuId;
  const [editingItem, setEditingItem] = useState<{ categoryId: string; item?: MenuItem } | null>(null);

  const categories = useMemo(() => {
    if (!cats.data?.categories) return [];
    const allItems = items.data?.items ?? [];
    return cats.data.categories.map((cat) => ({
      id: cat.id,
      title: cat.name,
      description: cat.description ?? "",
      emoji: cat.emoji ?? "",
      items: allItems.filter((i) => i.categoryId === cat.id).map((i) => ({
        id: i.id,
        name: i.name,
        description: i.description ?? "",
        price: Number(i.price),
        currency: "AED",
        image: i.imageUrl ?? undefined,
        tags: i.tags,
        isAvailable: i.isAvailable,
        isVeg: i.isVeg,
      })),
    }));
  }, [cats.data, items.data]);

  if (cats.isLoading || items.isLoading) return <MenuSkeleton />;
  if (cats.isError || items.isError) return <MenuError error={(cats.error || items.error) as Error} onRetry={() => { cats.refetch(); items.refetch(); }} />;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageHeader title="Menu Editor" description="Build categories, add dishes, set prices and images" />
        <ViewToggle view={view} onChange={setView} />
      </div>
      {categories.length === 0 ? (
        <MenuEmpty />
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <CategoryEditor key={cat.id} category={cat} view={view} onEditItem={(item) => setEditingItem({ categoryId: cat.id, item })} onAddItem={() => setEditingItem({ categoryId: cat.id })} />
          ))}
        </div>
      )}
      <CategoryCreator />
      {editingItem && <ItemEditorModal categoryId={editingItem.categoryId} item={editingItem.item} menuId={menuId} onClose={() => setEditingItem(null)} />}
    </div>
  );
}
