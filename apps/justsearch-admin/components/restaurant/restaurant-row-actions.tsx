import { Trash2 } from "lucide-react";

interface RestaurantRowActionsProps {
  onRemove: () => void;
}

export function RestaurantRowActions({ onRemove }: RestaurantRowActionsProps) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
