import Image from 'next/image';
import Link from "next/link";
import { Store, ArrowUpRight } from "lucide-react";
import type { AdminRestaurant } from "@/lib/types/admin-restaurant";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function WelcomeBar({ restaurant }: { restaurant: AdminRestaurant }) {
  const initials = getInitials(restaurant.name);
  const logoUrl = restaurant.logoUrl;
  const hasLogo = !!logoUrl;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
        {hasLogo ? (
          <Image
            src={logoUrl}
            alt={`${restaurant.name} logo`}
            width={400}
            height={400}
            priority
            className="h-full w-auto object-contain"
            unoptimized={logoUrl?.startsWith('http')}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-500">
            {initials}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-slate-900 truncate">{restaurant.name}</h1>
        <p className="text-sm text-slate-500 truncate">{restaurant.cuisine || "Restaurant"}</p>
      </div>
      <Link href="/homepage" className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shrink-0">
        <Store className="h-4 w-4" /> Edit Site <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
