"use client";

import Image from 'next/image';
import { ChefHat } from 'lucide-react';

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

interface SidebarBrandMarkProps {
  name: string;
  logoUrl?: string;
}

export function SidebarBrandMark({ name, logoUrl }: SidebarBrandMarkProps) {
  const initials = getInitials(name);

  if (logoUrl) {
    return (
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-amber-900/5 ring-1 ring-amber-100/80">
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          width={400}
          height={400}
          priority
          className="h-full w-auto object-contain"
          unoptimized={logoUrl.startsWith('http')}
        />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/25 ring-1 ring-white/60">
      {initials ? <span className="text-sm font-black">{initials}</span> : <ChefHat className="h-5 w-5" />}
    </div>
  );
}
