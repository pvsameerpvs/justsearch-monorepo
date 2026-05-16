"use client";

import Image from 'next/image';
import { ChefHat } from 'lucide-react';
import { useRestaurantProfile } from '@/lib/hooks/use-restaurant-profile';

export function SidebarBrand() {
  const { restaurant } = useRestaurantProfile();
  const name = restaurant?.name ?? 'Restaurant';
  const logoUrl = restaurant?.photos?.[0];

  return (
    <div className="flex items-center gap-3 px-5 py-6">
      {logoUrl ? (
        <Image src={logoUrl} alt={name} width={36} height={36} className="h-9 w-9 rounded-lg object-cover" />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
          <ChefHat className="h-5 w-5 text-amber-500" />
        </div>
      )}
      <div>
        <p className="text-sm font-bold text-white">{name}</p>
        <p className="text-[10px] text-slate-500">Restaurant Dashboard</p>
      </div>
    </div>
  );
}
