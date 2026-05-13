import { X } from "lucide-react";

interface OrdersDrawerHeaderProps {
  name: string;
  onClose: () => void;
}

export function OrdersDrawerHeader({ name, onClose }: OrdersDrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 p-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Driver Orders</p>
        <p className="text-sm font-bold text-slate-900">{name}</p>
      </div>
      <button
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
