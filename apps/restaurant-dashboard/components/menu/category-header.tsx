"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useMenuStore } from "@/lib/stores/menu-store";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import type { MenuCategory } from "@/lib/stores/menu-store";

interface CategoryHeaderProps {
  category: MenuCategory;
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  const { removeCategory, updateCategory } = useMenuStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(category.title);
  const desc = category.description;
  const [emoji, setEmoji] = useState(category.emoji ?? "");

  const save = () => {
    updateCategory(category.id, { title, description: desc, emoji: emoji || undefined });
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-2xl">{category.emoji}</span>
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <EmojiPicker value={emoji} onChange={setEmoji} size="sm" />
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
          <button onClick={save} className="elegant-btn-primary text-xs px-3">Save</button>
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
  );
}
