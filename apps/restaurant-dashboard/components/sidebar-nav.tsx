import { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Home, UtensilsCrossed, Settings, ShoppingBag, Truck, Users, BarChart3, Ticket, UserCircle, Shield } from 'lucide-react';
import { SidebarTooltip } from './sidebar/sidebar-tooltip';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const SECTIONS: NavSection[] = [
  { label: 'Overview', items: [{ href: '/', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'Your Restaurant', items: [{ href: '/homepage', label: 'Homepage', icon: Home }, { href: '/menu', label: 'Menu', icon: UtensilsCrossed }] },
  { label: 'Operations', items: [{ href: '/orders', label: 'Orders', icon: ShoppingBag }, { href: '/delivery', label: 'Delivery', icon: Truck }, { href: '/vouchers', label: 'Vouchers', icon: Ticket }, { href: '/staff', label: 'Staff', icon: Shield }] },
  { label: 'Growth', items: [{ href: '/customers', label: 'Customers', icon: Users }, { href: '/analytics', label: 'Analytics', icon: BarChart3 }] },
  { label: 'Account', items: [{ href: '/profile', label: 'Profile', icon: UserCircle }, { href: '/settings', label: 'Settings', icon: Settings }] },
];

interface SidebarNavProps {
  sections: NavSection[];
  collapsed?: boolean;
  onItemClick?: () => void;
}

export const SidebarNav = memo(function SidebarNav({ sections, collapsed, onItemClick }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={`sidebar-scrollbar-hidden flex-1 overflow-y-auto ${collapsed ? 'space-y-5 px-3 py-5' : 'space-y-6 px-4 py-5'}`}>
      {sections.map((section) => (
        <div key={section.label}>
          {!collapsed && (
            <p className="mb-2 flex items-center gap-2 px-3 text-[10px] font-black uppercase text-slate-400">
              <span>{section.label}</span>
              <span className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
            </p>
          )}
          <ul className={collapsed ? 'space-y-1.5' : 'space-y-1'}>
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const link = (
                <Link
                  href={item.href}
                  onClick={onItemClick}
                  className={`group relative flex items-center overflow-hidden rounded-2xl transition-all duration-200 ${collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5 text-sm font-semibold'} ${active ? 'bg-white text-slate-950 shadow-[0_16px_38px_-26px_rgba(245,158,11,0.9)] ring-1 ring-amber-100' : 'text-slate-500 hover:bg-white/80 hover:text-slate-900 hover:shadow-sm hover:ring-1 hover:ring-slate-100'}`}
                >
                  {active && <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-gradient-to-b from-amber-400 to-orange-500" />}
                  <div className={`flex shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${collapsed ? 'h-10 w-10' : 'h-8 w-8'} ${active ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-orange-500/20 group-hover:scale-105' : 'bg-slate-100/80 text-slate-400 group-hover:bg-white group-hover:text-amber-600 group-hover:shadow-sm'}`}>
                    <Icon className={collapsed ? 'h-4 w-4' : 'h-3.5 w-3.5'} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && active && <div className="ml-auto h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/30" />}
                  {collapsed && active && <div className="absolute right-1.5 h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/30" />}
                </Link>
              );
              return <li key={item.href}>{collapsed ? <SidebarTooltip label={item.label}>{link}</SidebarTooltip> : link}</li>;
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
});
