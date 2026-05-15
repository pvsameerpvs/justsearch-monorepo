"use client";

import Image from "next/image";
import { MenuItemActions } from "./menu-item-actions";

interface MenuItemRowProps {
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

export function MenuItemRow({ item, onEdit }: MenuItemRowProps) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${item.isAvailable ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50/50 opacity-50"}`}>
      {item.image ? (
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
        </div>
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
      <MenuItemActions itemId={item.id} isAvailable={item.isAvailable} onEdit={onEdit} />
    </div>
  );
}
