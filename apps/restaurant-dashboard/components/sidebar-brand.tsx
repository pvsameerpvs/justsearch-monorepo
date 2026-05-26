"use client";

import Image from 'next/image';
import { ChefHat } from 'lucide-react';
import { useRestaurantProfile } from '@/lib/hooks/use-restaurant-profile';

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function SidebarBrand() {
  const { restaurant } = useRestaurantProfile();
  const name = restaurant?.name ?? 'Restaurant';
  const logoUrl = restaurant?.logoUrl;
  const hasLogo = !!logoUrl;
  const initials = getInitials(name);

  return (
    <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100/60">
      {hasLogo ? (
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-md shadow-black/5 ring-1 ring-black/5">
          <Image
            src={logoUrl}
            alt={`${name} logo`}
            width={400}
            height={400}
            priority
            className="h-full w-auto object-contain"
            unoptimized={logoUrl?.startsWith('http')}
          />
        </div>
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/25 text-white">
          <ChefHat className="h-4 w-4" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate leading-tight">{name}</p>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Dashboard</p>
      </div>
    </div>
  );
}
