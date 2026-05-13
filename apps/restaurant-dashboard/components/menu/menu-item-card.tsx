import type { MenuItem } from "@/lib/stores/menu-store";
import { MenuItemActions } from "./menu-item-actions";

export function MenuItemCard({
  item,
  onToggle,
  onRemove,
  onEdit,
}: {
  item: MenuItem;
  onToggle: () => void;
  onRemove: () => void;
  onEdit?: () => void;
}) {
  return (
    <div
      className={`group rounded-xl border p-4 transition-all ${
        item.isAvailable ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50/50 opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-900 truncate">{item.name}</p>
            {!item.isAvailable && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
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
        <div className="mt-3 aspect-video overflow-hidden rounded-lg bg-slate-100">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        </div>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3">
        <MenuItemActions isAvailable={item.isAvailable} onEdit={onEdit} onToggle={onToggle} onRemove={onRemove} />
      </div>
    </div>
  );
}
