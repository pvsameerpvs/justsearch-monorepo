import { Menu, X } from 'lucide-react';

export function MobileToggle({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-slate-800 shadow-xl shadow-slate-900/10 backdrop-blur-xl transition-all hover:bg-amber-50 hover:text-amber-600 md:hidden"
      aria-label="Toggle"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}
