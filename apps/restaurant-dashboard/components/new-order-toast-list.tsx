import { Volume2 } from "lucide-react";
import { NewOrderToastCard } from "./new-order-toast-card";
import type { NewOrderToast } from "./hooks/use-new-order-notification";

interface NewOrderToastListProps {
  toasts: NewOrderToast[];
  flash: boolean;
  soundEnabled: boolean;
  isPlaying: boolean;
  onNavigate: () => void;
  onDismiss: (id: string) => void;
  onEnableSound: () => void;
  onStopSound: () => void;
}

export function NewOrderToastList({
  toasts,
  flash,
  soundEnabled,
  isPlaying,
  onNavigate,
  onDismiss,
  onEnableSound,
  onStopSound,
}: NewOrderToastListProps) {
  return (
    <>
      {flash && (
        <div className="fixed inset-0 z-[70] pointer-events-none animate-in fade-out duration-500">
          <div className="absolute inset-0 bg-amber-500/10" />
        </div>
      )}

      <div className="fixed top-4 left-0 right-0 z-[60] flex flex-col items-center gap-2 pointer-events-none px-4">
        {!soundEnabled && (
          <button
            onClick={onEnableSound}
            className="pointer-events-auto mb-2 flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-amber-500/30 hover:bg-amber-600 hover:scale-105 transition-all animate-bounce"
          >
            <Volume2 className="h-5 w-5" />
            <span className="hidden sm:inline">CLICK TO ENABLE ORDER ALARM SOUND</span>
            <span className="sm:hidden">ENABLE SOUND</span>
          </button>
        )}

        {toasts.map((toast, idx) => (
          <NewOrderToastCard
            key={toast.id}
            toast={toast}
            idx={idx}
            isPlaying={isPlaying}
            onNavigate={onNavigate}
            onDismiss={onDismiss}
            onStopSound={onStopSound}
          />
        ))}
      </div>
    </>
  );
}
