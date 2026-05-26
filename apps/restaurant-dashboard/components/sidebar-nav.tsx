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
    <nav className={`flex-1 overflow-y-auto ${collapsed ? 'px-2 py-4 space-y-4' : 'px-3 py-5 space-y-5'}`}>
      {sections.map((section) => (
        <div key={section.label}>
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400/80">{section.label}</p>
          )}
          <ul className={collapsed ? 'space-y-1' : 'space-y-0.5'}>
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const link = (
                <Link
                  href={item.href}
                  onClick={onItemClick}
                  className={`group relative flex items-center rounded-xl transition-all duration-200 ${collapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2.5 text-sm font-medium'} ${active ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 shadow-sm shadow-amber-500/10 border border-amber-100/50 font-semibold' : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-700'}`}
                >
                  <div className={`flex shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${collapsed ? 'h-9 w-9' : 'h-7 w-7'} ${active ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/20 text-white group-hover:scale-105' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-slate-500'}`}>
                    <Icon className={collapsed ? 'h-4 w-4' : 'h-3.5 w-3.5'} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/30" />}
                  {collapsed && active && <div className="absolute right-1 h-1.5 w-1.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/30" />}
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
