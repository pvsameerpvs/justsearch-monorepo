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
    <nav className="flex gap-1.5 mb-5 p-1 bg-slate-100/80 rounded-2xl">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all select-none",
              active
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Icon className={cn("h-4 w-4", active ? "text-emerald-600" : "text-slate-400")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
