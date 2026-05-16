"use client";

import { memo, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Home, UtensilsCrossed, Settings, ShoppingBag, Truck, Users, BarChart3, Ticket, UserCircle } from 'lucide-react';
import { SidebarFooter } from './dashboard-sidebar-footer';
import { MobileToggle } from './mobile-toggle';
import { SidebarBrand } from './sidebar-brand';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  { label: 'Overview', items: [{ href: '/', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'Your Restaurant', items: [{ href: '/homepage', label: 'Homepage', icon: Home }, { href: '/menu', label: 'Menu', icon: UtensilsCrossed }] },
  { label: 'Operations', items: [{ href: '/orders', label: 'Orders', icon: ShoppingBag }, { href: '/delivery', label: 'Delivery', icon: Truck }, { href: '/vouchers', label: 'Vouchers', icon: Ticket }] },
  { label: 'Growth', items: [{ href: '/customers', label: 'Customers', icon: Users }, { href: '/analytics', label: 'Analytics', icon: BarChart3 }] },
  { label: 'Account', items: [{ href: '/profile', label: 'Profile', icon: UserCircle }, { href: '/settings', label: 'Contact & Socials', icon: Settings }] },
];

function getItemClasses(active: boolean): string {
  const base = 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200';
  if (active) {
    return base + ' bg-white/10 text-white shadow-sm';
  }
  return base + ' text-slate-400 hover:bg-white/5 hover:text-slate-200';
}

export const DashboardSidebar = memo(function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((p) => !p), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <MobileToggle isOpen={isOpen} onToggle={toggle} />
      {isOpen && <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden" onClick={close} />}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-[260px] flex-col bg-[#0B0F19] transition-transform duration-300 md:translate-x-0" style={{ transform: isOpen ? 'translateX(0)' : undefined }}>
        <SidebarBrand />
        <nav className="flex-1 space-y-5 px-3 py-2 overflow-y-auto">
          {SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600">{section.label}</p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className={getItemClasses(active)}
                      >
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.5 : 2} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <SidebarFooter />
      </aside>
    </>
  );
});
