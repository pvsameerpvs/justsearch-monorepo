"use client";

import { useState } from "react";
import { useMenuStore } from "@/lib/stores/menu-store";
import { Plus } from "lucide-react";
import { MenuItemCard } from "./menu-item-card";
import { AddMenuItemForm, AddMenuItemButton } from "./menu-item-form";

export function MenuManager() {
  const { categories, addCategory, addItem, removeItem, toggleItem } = useMenuStore();
  const [active, setActive] = useState(categories[0]?.id ?? "");
  const [showForm, setShowForm] = useState(false);
  const [newCat, setNewCat] = useState("");

  const cat = categories.find((c) => c.id === active);

  return (
    <div className="space-y-5">
      <CategoryTabs categories={categories} active={active} onSelect={setActive} newCat={newCat} onNewCatChange={setNewCat} onAddCat={() => {
        if (newCat.trim()) { addCategory(newCat.trim()); setNewCat(""); }
      }} />

      <div className="grid gap-3 sm:grid-cols-2">
        {cat?.items.map((item) => (
          <MenuItemCard key={item.id} item={item} onToggle={() => toggleItem(active, item.id)} onRemove={() => removeItem(active, item.id)} />
        ))}
      </div>

      {showForm ? (
        <AddMenuItemForm onSubmit={(data) => { if (!active) return; addItem(active, { ...data, categoryId: active, isAvailable: true }); setShowForm(false); }} onCancel={() => setShowForm(false)} />
      ) : (
        <AddMenuItemButton onClick={() => setShowForm(true)} />
      )}
    </div>
  );
}

function CategoryTabs({ categories, active, onSelect, newCat, onNewCatChange, onAddCat }: {
  categories: { id: string; title: string; items: unknown[] }[];
  active: string;
  onSelect: (id: string) => void;
  newCat: string;
  onNewCatChange: (val: string) => void;
  onAddCat: () => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((c) => (
        <button key={c.id} onClick={() => onSelect(c.id)} className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
          active === c.id ? "bg-slate-900 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
        }`}>
          {c.title}
          <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${active === c.id ? "bg-white/20" : "bg-slate-100"}`}>{c.items.length}</span>
        </button>
      ))}
      <div className="flex shrink-0 items-center gap-2">
        <input value={newCat} onChange={(e) => onNewCatChange(e.target.value)} placeholder="New category" className="elegant-input w-32 text-xs" />
        <button onClick={onAddCat} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
