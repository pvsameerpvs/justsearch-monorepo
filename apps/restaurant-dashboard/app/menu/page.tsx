"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@justsearch/ui";
import { useMenuStore } from "@/lib/stores/menu-store";
import { CategoryEditor } from "@/components/menu/category-editor";
import { ItemEditorModal } from "@/components/menu/item-editor-modal";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import { ViewToggle } from "@/components/ui/view-toggle";

export default function MenuPage() {
  const { categories, addCategory } = useMenuStore();
  const [view, setView] = useState<"list" | "grid">("list");
  const [editingItem, setEditingItem] = useState<{
    categoryId: string;
    item?: ReturnType<typeof useMenuStore.getState>["categories"][number]["items"][number];
  } | null>(null);
  const [newCatTitle, setNewCatTitle] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatEmoji, setNewCatEmoji] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PageHeader title="Menu Editor" description="Build categories, add dishes, set prices and images" />
        <ViewToggle view={view} onChange={setView} />
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <CategoryEditor
            key={cat.id}
            category={cat}
            view={view}
            onEditItem={(item) => setEditingItem({ categoryId: cat.id, item })}
            onAddItem={() => setEditingItem({ categoryId: cat.id })}
          />
        ))}
      </div>

      <div className="elegant-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Plus className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Add Category</h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <EmojiPicker value={newCatEmoji} onChange={setNewCatEmoji} size="sm" />
          <input value={newCatTitle} onChange={(e) => setNewCatTitle(e.target.value)} placeholder="Category name" className="elegant-input flex-1 min-w-[160px]" />
          <input value={newCatDesc} onChange={(e) => setNewCatDesc(e.target.value)} placeholder="Description" className="elegant-input flex-1 min-w-[160px]" />
          <button
            onClick={() => {
              if (newCatTitle.trim()) { addCategory(newCatTitle.trim(), newCatDesc, newCatEmoji); setNewCatTitle(""); setNewCatDesc(""); setNewCatEmoji(""); }
            }}
            className="elegant-btn-primary shrink-0"
          >
            Add Category
          </button>
        </div>
      </div>

      {editingItem && (
        <ItemEditorModal
          categoryId={editingItem.categoryId}
          item={editingItem.item}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
