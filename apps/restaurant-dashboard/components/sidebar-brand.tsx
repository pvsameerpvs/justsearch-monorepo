"use client";

import { useRestaurantProfile } from '@/lib/hooks/use-restaurant-profile';
import { SidebarBrandMark } from './sidebar/sidebar-brand-mark';
import { SoundToggle } from './sound-toggle';

interface SidebarBrandProps {
  collapsed?: boolean;
}

export function SidebarBrand({ collapsed = false }: SidebarBrandProps) {
  const { restaurant } = useRestaurantProfile();
  const name = restaurant?.name ?? 'Restaurant';
  const logoUrl = restaurant?.logoUrl;

  if (collapsed) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-white/55 p-1 shadow-inner shadow-amber-900/5 ring-1 ring-amber-100/70">
        <SidebarBrandMark name={name} logoUrl={logoUrl} />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <SidebarBrandMark name={name} logoUrl={logoUrl} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black leading-tight text-slate-950">{name}</p>
        <p className="mt-0.5 text-[10px] font-bold uppercase text-amber-600">Dashboard</p>
      </div>
      <SoundToggle />
    </div>
  );
}
