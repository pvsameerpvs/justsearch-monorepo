"use client";

import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useMenuStore } from "@/lib/stores/menu-store";

interface MenuItemRowProps {
  categoryId: string;
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    image?: string;
    tags?: string[];
    subcategory?: string;
    isAvailable: boolean;
  };
  onEdit: () => void;
}

export function MenuItemRow({ categoryId, item, onEdit }: MenuItemRowProps) {
  const { toggleItem, removeItem } = useMenuStore();

  return (
    <div className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${item.isAvailable ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50/50 opacity-50"}`}>
      {item.image ? (
        <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 shrink-0 text-xs font-bold text-slate-400">{item.name.slice(0, 2).toUpperCase()}</div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
          {item.tags?.map((tag) => (
            <span key={tag} className="hidden sm:inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">{tag}</span>
          ))}
        </div>
        <p className="text-xs text-slate-500 truncate">{item.description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs font-bold text-slate-700">{item.price} {item.currency}</p>
          {item.subcategory && <span className="text-[10px] text-slate-400">• {item.subcategory}</span>}
        </div>
      </div>
      <div className="flex gap-1 shrink-0">
        <button onClick={onEdit} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => toggleItem(categoryId, item.id)} className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
          {item.isAvailable ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>
        <button onClick={() => removeItem(categoryId, item.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
