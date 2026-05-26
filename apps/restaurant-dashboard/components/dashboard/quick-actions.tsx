import Link from "next/link";
import { Home, UtensilsCrossed, Settings, Ticket, Truck, Users, BarChart3 } from "lucide-react";

const ACTIONS = [
  { label: "Homepage", href: "/homepage", icon: Home, gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-500/20" },
  { label: "Menu", href: "/menu", icon: UtensilsCrossed, gradient: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-500/20" },
  { label: "Settings", href: "/settings", icon: Settings, gradient: "from-slate-500 to-slate-600", shadow: "shadow-slate-500/20" },
  { label: "Vouchers", href: "/vouchers", icon: Ticket, gradient: "from-violet-400 to-purple-500", shadow: "shadow-violet-500/20" },
  { label: "Delivery", href: "/delivery", icon: Truck, gradient: "from-blue-400 to-indigo-500", shadow: "shadow-blue-500/20" },
  { label: "Customers", href: "/customers", icon: Users, gradient: "from-rose-400 to-pink-500", shadow: "shadow-rose-500/20" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, gradient: "from-orange-400 to-amber-500", shadow: "shadow-orange-500/20" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
      {ACTIONS.map((a) => {
        const Icon = a.icon;
        return (
          <Link
            key={a.href}
            href={a.href}
            className="group flex flex-col items-center gap-2.5 rounded-2xl border border-slate-200/60 bg-white/80 p-3 backdrop-blur-sm shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] hover:bg-white hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${a.gradient} shadow-lg ${a.shadow} text-white transition-transform duration-300 group-hover:scale-110`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{a.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
