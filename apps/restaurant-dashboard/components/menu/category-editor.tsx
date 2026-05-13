"use client";

import { useState } from "react";
import { useMenuStore, type MenuCategory } from "@/lib/stores/menu-store";
import { Pencil, Trash2, Plus } from "lucide-react";
import { MenuItemRow } from "./menu-item-row";

export function CategoryEditor({
  category,
  onEditItem,
  onAddItem,
}: {
  category: MenuCategory;
  onEditItem: (item: MenuCategory["items"][number]) => void;
  onAddItem: () => void;
}) {
  const { removeCategory, updateCategory } = useMenuStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(category.title);
  const [desc, setDesc] = useState(category.description);
  const [emoji, setEmoji] = useState(category.emoji ?? "");

  const saveCategory = () => {
    updateCategory(category.id, { title, description: desc, emoji: emoji || undefined });
    setIsEditing(false);
  };

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">{category.emoji}</span>
          {isEditing ? (
            <div className="flex gap-2 flex-1">
              <input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="Emoji" className="elegant-input w-20" />
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Name" className="elegant-input flex-1" />
            </div>
          ) : (
            <div>
              <h3 className="text-base font-bold text-slate-900">{category.title}</h3>
              <p className="text-xs text-slate-500">{category.description}</p>
            </div>
          )}
        </div>
        <div className="flex gap-1">
          {isEditing ? (
            <button onClick={saveCategory} className="elegant-btn-primary text-xs px-3">Save</button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          <button onClick={() => removeCategory(category.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {category.items.map((item) => (
          <MenuItemRow key={item.id} categoryId={category.id} item={item} onEdit={() => onEditItem(item)} />
        ))}
        <button onClick={onAddItem} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-medium text-slate-400 hover:border-slate-300 hover:text-slate-600">
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>
    </div>
  );
}
