import { ChefHat } from 'lucide-react';

export function SidebarFooter() {
  return (
    <div className="border-t border-white/5 p-3">
      <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-500">
          MT
        </div>
        <div>
          <p className="text-xs font-semibold text-white">Admin</p>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <p className="text-[10px] text-emerald-500">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}
