import Image from "next/image";
import { MenuItemActions } from "./menu-item-actions";
import type { MenuItem } from "@/lib/stores/menu-store";

export function MenuItemCard({
  item,
  onEdit,
}: {
  item: MenuItem;
  onEdit?: () => void;
}) {
  return (
    <div
      className={`group rounded-2xl border p-4 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] ${
        item.isAvailable ? "border-slate-100 bg-white" : "border-slate-100 bg-slate-50/60 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-900 truncate">{item.name}</p>
            {item.isVeg && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-100">
                Veg
              </span>
            )}
            {!item.isAvailable && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 border border-slate-200">
                Hidden
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{item.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-sm font-bold text-slate-900">AED {item.price}</p>
            {item.subcategory && (
              <span className="text-[10px] text-slate-400">{item.subcategory}</span>
            )}
          </div>
        </div>
      </div>

      {item.image && (
        <div className="relative mt-3 aspect-video overflow-hidden rounded-xl bg-slate-100">
          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 300px" />
        </div>
      )}

      {Array.isArray(item.tags) && item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-100">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3">
        <MenuItemActions itemId={item.id} itemName={item.name} isAvailable={item.isAvailable} onEdit={onEdit} />
      </div>
    </div>
  );
}
