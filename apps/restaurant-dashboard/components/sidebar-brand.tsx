"use client";

import Image from 'next/image';
import { ChefHat } from 'lucide-react';
import { useRestaurantProfile } from '@/lib/hooks/use-restaurant-profile';
import { SoundToggle } from './sound-toggle';

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

interface SidebarBrandProps {
  collapsed?: boolean;
}

export function SidebarBrand({ collapsed = false }: SidebarBrandProps) {
  const { restaurant } = useRestaurantProfile();
  const name = restaurant?.name ?? 'Restaurant';
  const logoUrl = restaurant?.logoUrl;
  const hasLogo = !!logoUrl;
  const initials = getInitials(name);

  if (collapsed) {
    return (
      <div className="flex items-center justify-center">
        {hasLogo ? (
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-md shadow-black/5 ring-1 ring-black/5">
            <Image src={logoUrl} alt={`${name} logo`} width={400} height={400} priority className="h-full w-auto object-contain" unoptimized={logoUrl?.startsWith('http')} />
          </div>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/25 text-white">
            <ChefHat className="h-4 w-4" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {hasLogo ? (
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-md shadow-black/5 ring-1 ring-black/5">
          <Image src={logoUrl} alt={`${name} logo`} width={400} height={400} priority className="h-full w-auto object-contain" unoptimized={logoUrl?.startsWith('http')} />
        </div>
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/25 text-white">
          <ChefHat className="h-4 w-4" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate leading-tight">{name}</p>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Dashboard</p>
      </div>
      <SoundToggle />
    </div>
  );
}
