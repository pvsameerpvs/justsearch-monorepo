import Link from "next/link";
import { LayoutDashboard, List } from "lucide-react";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "My Orders", icon: List },
];

export function PortalNav() {
  return (
    <div className="flex gap-2 border-b border-slate-100 px-6 py-3">
      {NAV.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:bg-slate-50"
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
