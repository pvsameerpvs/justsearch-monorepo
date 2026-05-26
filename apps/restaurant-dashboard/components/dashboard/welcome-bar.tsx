import Image from 'next/image';
import Link from "next/link";
import { Store, ArrowUpRight, Sparkles } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 shadow-2xl shadow-slate-900/20 border border-slate-700/30">
      <div className="absolute top-0 right-0 h-64 w-64 translate-x-16 -translate-y-16 opacity-10">
        <div className="h-full w-full rounded-full bg-gradient-to-br from-amber-400 to-orange-500 blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-12 translate-y-12 opacity-10">
        <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 blur-3xl" />
      </div>

      <div className="relative flex items-center gap-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl overflow-hidden ring-2 ring-white/10 shadow-xl">
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
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-amber-400 to-orange-500">
              {initials}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white truncate">{restaurant.name}</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
          <p className="text-sm text-slate-400 truncate">{restaurant.cuisine || "Restaurant"} · Managing your digital storefront</p>
        </div>
        <Link href="/homepage" className="group flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10 shrink-0">
          <Store className="h-4 w-4" /> Edit Site <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
