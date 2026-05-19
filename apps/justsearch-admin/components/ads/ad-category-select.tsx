import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import type { AdCategory } from "@/lib/hooks/use-ad-categories-query";

interface AdCategorySelectProps {
  value: string;
  categories: AdCategory[];
  isLoading?: boolean;
  error?: string | null;
  onChange: (value: string) => void;
  onAddCategory?: (name: string) => void;
}

export function AdCategorySelect({ value, categories, isLoading, error, onChange, onAddCategory }: AdCategorySelectProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const activeCategories = categories.filter((c) => c.isActive);
  const isUnknownValue = value && !activeCategories.some((c) => c.name === value);

  const handleAddNew = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !activeCategories.some((c) => c.name === trimmed)) {
      onAddCategory?.(trimmed);
      onChange(trimmed);
      setNewCategory("");
      setIsAddingNew(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm hover:border-slate-300 ${isUnknownValue ? 'border-amber-300 text-amber-700' : 'border-slate-200 text-slate-700'}`}
      >
        <span>{value || "Select category"}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
      {isUnknownValue && <p className="mt-1 text-xs text-amber-600">Category not in current list — will be created on save</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="max-h-60 overflow-y-auto py-1">
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-slate-400">Loading categories...</div>
            ) : (
              <>
                {activeCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => { onChange(cat.name); setIsOpen(false); }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${value === cat.name ? 'bg-slate-50 font-medium text-slate-900' : 'text-slate-700'}`}
                  >
                    {cat.name}
                  </button>
                ))}
                <div className="border-t border-slate-100 pt-1">
                  {!isAddingNew ? (
                    <button type="button" onClick={() => setIsAddingNew(true)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-slate-50">
                      <Plus className="h-4 w-4" />Add new category
                    </button>
                  ) : (
                    <div className="px-3 py-2">
                      <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Enter category name" className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:border-amber-500 focus:outline-none" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNew(); } }} autoFocus />
                      <div className="mt-2 flex gap-2">
                        <button type="button" onClick={handleAddNew} className="rounded-md bg-amber-500 px-3 py-1 text-xs font-medium text-white hover:bg-amber-600">Add</button>
                        <button type="button" onClick={() => { setIsAddingNew(false); setNewCategory(""); }} className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
