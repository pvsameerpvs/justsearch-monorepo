import { X, Pencil, Check } from "lucide-react";
import { RestaurantStatusBadge } from "./restaurant-status-badge";
import type { AdminRestaurant } from "@/lib/types/restaurant.types";

interface RestaurantDetailHeaderProps {
  restaurant: AdminRestaurant;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export function RestaurantDetailHeader({
  restaurant,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onClose,
}: RestaurantDetailHeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 backdrop-blur px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900">{restaurant.name}</h2>
          <RestaurantStatusBadge status={restaurant.status} />
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <button onClick={onCancel} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
              <button onClick={onSave} className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
                <Check className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button onClick={onEdit} className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200">
              <Pencil className="h-3 w-3" /> Edit
            </button>
          )}
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 ml-1">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
