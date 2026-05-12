import { ChefHat } from 'lucide-react';
import type { Restaurant } from '@justsearch/utils';

export function SidebarBrand({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="flex items-center gap-3 px-5 py-6">
      {restaurant.logoUrl ? (
        <img
          src={restaurant.logoUrl}
          alt={restaurant.name}
          className="h-9 w-9 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
          <ChefHat className="h-5 w-5 text-amber-500" />
        </div>
      )}
      <div>
        <p className="text-sm font-bold text-white">{restaurant.name}</p>
        <p className="text-[10px] text-slate-500">Restaurant Dashboard</p>
      </div>
    </div>
  );
}
