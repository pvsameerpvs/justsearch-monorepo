"use client";

import { memo, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Home, UtensilsCrossed, Settings, ShoppingBag, Truck, Users, BarChart3, Ticket, UserCircle, Shield } from 'lucide-react';
import { SidebarFooter } from './dashboard-sidebar-footer';
import { MobileToggle } from './mobile-toggle';
import { SidebarBrand } from './sidebar-brand';
import { useDashboardAuth } from '@/lib/auth-context';
import { filterSidebarSections } from '@/lib/utils/role-guards';

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
  { label: 'Operations', items: [{ href: '/orders', label: 'Orders', icon: ShoppingBag }, { href: '/delivery', label: 'Delivery', icon: Truck }, { href: '/vouchers', label: 'Vouchers', icon: Ticket }, { href: '/staff', label: 'Staff', icon: Shield }] },
  { label: 'Growth', items: [{ href: '/customers', label: 'Customers', icon: Users }, { href: '/analytics', label: 'Analytics', icon: BarChart3 }] },
  { label: 'Account', items: [{ href: '/profile', label: 'Profile', icon: UserCircle }, { href: '/settings', label: 'Contact & Socials', icon: Settings }] },
];

export const DashboardSidebar = memo(function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((p) => !p), []);
  const close = useCallback(() => setIsOpen(false), []);
  const { user } = useDashboardAuth();
  const visibleSections = filterSidebarSections(user?.role, SECTIONS);

  return (
    <>
      <MobileToggle isOpen={isOpen} onToggle={toggle} />
      {isOpen && <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden" onClick={close} />}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-[260px] flex-col bg-white border-r border-slate-100 transition-transform duration-300 md:translate-x-0" style={{ transform: isOpen ? 'translateX(0)' : undefined }}>
        <SidebarBrand />
        <nav className="flex-1 space-y-4 px-3 py-2 overflow-y-auto">
          {visibleSections.map((section) => (
            <div key={section.label}>
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">{section.label}</p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className={active ? 'sidebar-nav-item-active' : 'sidebar-nav-item-inactive'}
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
