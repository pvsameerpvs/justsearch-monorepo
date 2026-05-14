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
    <div className="flex gap-1 mb-4">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition",
              active
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
