"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Orders", icon: Home },
  { href: "/history", label: "History", icon: RotateCcw },
];

export function PortalNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-4 grid grid-cols-2 gap-1 rounded-2xl border border-white/70 bg-white/75 p-1 shadow-sm shadow-slate-200/70 backdrop-blur">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold transition-all select-none",
              active
                ? "bg-slate-950 text-white shadow-sm shadow-slate-950/10"
                : "text-slate-500 hover:bg-white hover:text-slate-800"
            )}
          >
            <Icon className={cn("h-3.5 w-3.5", active ? "text-emerald-300" : "text-slate-400")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
