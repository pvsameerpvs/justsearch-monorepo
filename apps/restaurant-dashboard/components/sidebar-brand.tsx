import { ChefHat } from 'lucide-react';

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-3 px-5 py-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
        <ChefHat className="h-5 w-5 text-amber-500" />
      </div>
      <div>
        <p className="text-sm font-bold text-white">Mosaic Table</p>
        <p className="text-[10px] text-slate-500">Restaurant Dashboard</p>
      </div>
    </div>
  );
}
