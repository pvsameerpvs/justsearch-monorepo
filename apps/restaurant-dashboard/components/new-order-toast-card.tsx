import { Bell, X, ShoppingBag, ArrowRight, VolumeX } from "lucide-react";
import type { NewOrderToast } from "./hooks/use-new-order-notification";

interface NewOrderToastCardProps {
  toast: NewOrderToast;
  idx: number;
  isPlaying: boolean;
  onNavigate: () => void;
  onDismiss: (id: string) => void;
  onStopSound: () => void;
}

export function NewOrderToastCard({ toast, idx, isPlaying, onNavigate, onDismiss, onStopSound }: NewOrderToastCardProps) {
  return (
    <div
      onClick={onNavigate}
      className="group pointer-events-auto w-full max-w-md cursor-pointer animate-in slide-in-from-top-2 fade-in duration-300"
      style={{ animationDelay: `${idx * 50}ms` }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-slate-900/30 ring-1 ring-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/30">
        <div className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
        <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl" />
        <div className="flex items-center gap-3 px-5 py-4 pl-6">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25 text-white">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-slate-900 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                <Bell className="h-2.5 w-2.5" /> NEW ORDER
              </span>
              <span className="text-xs font-bold text-slate-500">{toast.code}</span>
            </div>
            <p className="text-sm font-bold text-white mt-0.5 truncate">{toast.customerName}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold text-amber-400">
                AED {Math.round(Number(toast.total || 0)).toLocaleString()}
              </span>
              {toast.items !== undefined && <span className="text-xs text-slate-500">{toast.items} items</span>}
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-amber-400 transition-colors shrink-0">
            View <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
          {isPlaying && (
            <button onClick={(e) => { e.stopPropagation(); onStopSound(); }} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors" title="Stop alarm">
              <VolumeX className="h-3.5 w-3.5" />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); onDismiss(toast.id); }} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="h-[2px] w-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 notification-progress" />
        </div>
      </div>
    </div>
  );
}
