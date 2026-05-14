import Link from "next/link";
import { Home, UtensilsCrossed, Settings, Ticket, Truck, Users, BarChart3 } from "lucide-react";

const ACTIONS = [
  { label: "Homepage", href: "/homepage", icon: Home, color: "bg-amber-50 text-amber-600" },
  { label: "Menu", href: "/menu", icon: UtensilsCrossed, color: "bg-emerald-50 text-emerald-600" },
  { label: "Settings", href: "/settings", icon: Settings, color: "bg-slate-50 text-slate-600" },
  { label: "Vouchers", href: "/vouchers", icon: Ticket, color: "bg-violet-50 text-violet-600" },
  { label: "Delivery", href: "/delivery", icon: Truck, color: "bg-blue-50 text-blue-600" },
  { label: "Customers", href: "/customers", icon: Users, color: "bg-pink-50 text-pink-600" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, color: "bg-orange-50 text-orange-600" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
      {ACTIONS.map((a) => {
        const Icon = a.icon;
        return (
          <Link key={a.href} href={a.href} className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:border-slate-300 hover:shadow-md transition-all">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${a.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700">{a.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
