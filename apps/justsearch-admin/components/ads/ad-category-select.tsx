import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

const DEFAULT_CATEGORIES = [
  "Restaurant",
  "Supermarket",
  "Electronics",
  "Fashion",
  "Healthcare",
  "Automotive",
  "Real Estate",
  "Education",
  "Banking",
  "Telecom",
  "Travel",
  "Food Delivery",
  "Beauty",
  "Fitness",
  "Entertainment",
];

interface AdCategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function AdCategorySelect({ value, onChange }: AdCategorySelectProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddNew = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updated = [...categories, newCategory.trim()];
      setCategories(updated);
      onChange(newCategory.trim());
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
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-slate-300"
      >
        <span>{value || "Select category"}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="max-h-60 overflow-y-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { onChange(cat); setIsOpen(false); }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${value === cat ? 'bg-slate-50 font-medium text-slate-900' : 'text-slate-700'}`}
              >
                {cat}
              </button>
            ))}
            <div className="border-t border-slate-100 pt-1">
              {!isAddingNew ? (
                <button
                  type="button"
                  onClick={() => setIsAddingNew(true)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />
                  Add new category
                </button>
              ) : (
                <div className="px-3 py-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name"
                    className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:border-amber-500 focus:outline-none"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNew(); } }}
                    autoFocus
                  />
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={handleAddNew} className="rounded-md bg-amber-500 px-3 py-1 text-xs font-medium text-white hover:bg-amber-600">Add</button>
                    <button type="button" onClick={() => { setIsAddingNew(false); setNewCategory(""); }} className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
