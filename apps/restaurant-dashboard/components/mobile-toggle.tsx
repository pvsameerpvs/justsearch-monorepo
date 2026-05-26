import { Menu, X } from 'lucide-react';

export function MobileToggle({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 backdrop-blur-xl text-slate-700 shadow-lg shadow-black/5 border border-slate-200/60 md:hidden hover:bg-white transition-all"
      aria-label="Toggle"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}
