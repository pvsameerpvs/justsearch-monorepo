"use client";

import { memo, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Home, UtensilsCrossed, Settings, ShoppingBag, Truck, Users, BarChart3, Ticket } from 'lucide-react';
import { SidebarFooter } from './dashboard-sidebar-footer';
import { MobileToggle } from './mobile-toggle';
import { SidebarBrand } from './sidebar-brand';
import type { Restaurant } from '@justsearch/utils';

const SECTIONS = [
  { label: 'Overview', items: [{ href: '/', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'Your Restaurant', items: [{ href: '/homepage', label: 'Homepage', icon: Home }, { href: '/menu', label: 'Menu', icon: UtensilsCrossed }] },
  { label: 'Operations', items: [{ href: '/orders', label: 'Orders', icon: ShoppingBag }, { href: '/delivery', label: 'Delivery', icon: Truck }, { href: '/vouchers', label: 'Vouchers', icon: Ticket }] },
  { label: 'Growth', items: [{ href: '/customers', label: 'Customers', icon: Users }, { href: '/analytics', label: 'Analytics', icon: BarChart3 }] },
  { label: 'Settings', items: [{ href: '/settings', label: 'Contact & Socials', icon: Settings }] },
];

export const DashboardSidebar = memo(function DashboardSidebar({ restaurant }: { restaurant: Restaurant }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((p) => !p), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <MobileToggle isOpen={isOpen} onToggle={toggle} />
      {isOpen && <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden" onClick={close} />}
      <aside className={`fixed left-0 top-0 z-40 flex h-full w-[260px] flex-col bg-[#0B0F19] text-white transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarBrand restaurant={restaurant} />
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
                      <Link href={item.href} onClick={close} className={active ? 'sidebar-item-active' : 'sidebar-item-inactive'}>
                        <Icon className="h-4 w-4" strokeWidth={active ? 2.5 : 2} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <SidebarFooter restaurant={restaurant} />
      </aside>
    </>
  );
});
