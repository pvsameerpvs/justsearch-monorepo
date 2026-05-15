"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import { useCreateMenuCategoryMutation } from "@/lib/hooks/use-menu-query";

export function CategoryCreator() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [emoji, setEmoji] = useState("");
  const create = useCreateMenuCategoryMutation();

  const handleAdd = () => {
    if (!title.trim()) return;
    create.mutate({ name: title.trim(), description: desc, sortOrder: 0 });
    setTitle("");
    setDesc("");
    setEmoji("");
  };

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Plus className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Add Category</h3>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <EmojiPicker value={emoji} onChange={setEmoji} size="sm" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Category name" className="elegant-input flex-1 min-w-[160px]" />
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="elegant-input flex-1 min-w-[160px]" />
        <button onClick={handleAdd} className="elegant-btn-primary shrink-0">Add Category</button>
      </div>
    </div>
  );
}
