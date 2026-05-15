import { ImagePlus } from "lucide-react";

interface RestaurantUploadTriggerProps {
  remaining: number;
  onClick: () => void;
}

export function RestaurantUploadTrigger({ remaining, onClick }: RestaurantUploadTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 text-slate-400 hover:border-amber-400 hover:bg-amber-50/30 hover:text-amber-600 transition-all"
    >
      <ImagePlus className="h-6 w-6" />
      <span className="text-[10px] font-bold">Add Photo</span>
      <span className="text-[10px]">{remaining} left</span>
    </button>
  );
}
