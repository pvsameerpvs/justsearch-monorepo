"use client";

import { Plus } from "lucide-react";
import { MenuItemRow } from "./menu-item-row";
import { MenuItemCard } from "./menu-item-card";
import { CategoryHeader } from "./category-header";
import type { MenuCategory } from "@/lib/stores/menu-store";

interface CategoryEditorProps {
  category: MenuCategory;
  onEditItem: (item: MenuCategory["items"][number]) => void;
  onAddItem: () => void;
  view: "list" | "grid";
}

export function CategoryEditor({ category, onEditItem, onAddItem, view }: CategoryEditorProps) {
  return (
    <div className="elegant-card p-5">
      <CategoryHeader category={category} />

      {view === "list" ? (
        <div className="space-y-2">
          {category.items.map((item) => (
            <MenuItemRow key={item.id} item={item} onEdit={() => onEditItem(item)} />
          ))}
          <button onClick={onAddItem} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-medium text-slate-400 hover:border-slate-300 hover:text-slate-600">
            <Plus className="h-4 w-4" /> Add Item
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {category.items.map((item) => (
            <MenuItemCard key={item.id} item={item} onEdit={() => onEditItem(item)} />
          ))}
          <button onClick={onAddItem} className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-4 text-slate-400 hover:border-slate-300 hover:text-slate-600 min-h-[120px]">
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">Add Item</span>
          </button>
        </div>
      )}
    </div>
  );
}
