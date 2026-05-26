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
    <div className="flex items-center gap-3 px-5 py-5">
      {hasLogo ? (
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          width={400}
          height={400}
          priority
          className="h-8 w-auto object-contain"
          unoptimized={logoUrl?.startsWith('http')}
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm shadow-orange-500/20">
          <span className="text-[10px] font-bold text-white">{initials}</span>
          
        </div>
      )}
     
    </div>
  );
}
