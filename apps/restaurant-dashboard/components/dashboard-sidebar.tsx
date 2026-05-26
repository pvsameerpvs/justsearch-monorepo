"use client";

import { memo, useState, useCallback } from 'react';
import { SidebarFooter } from './dashboard-sidebar-footer';
import { MobileToggle } from './mobile-toggle';
import { SidebarBrand } from './sidebar-brand';
import { SidebarNav, SECTIONS } from './sidebar-nav';
import { useDashboardAuth } from '@/lib/auth-context';
import { filterSidebarSections } from '@/lib/utils/role-guards';

export const DashboardSidebar = memo(function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((p) => !p), []);
  const close = useCallback(() => setIsOpen(false), []);
  const { user } = useDashboardAuth();
  const visibleSections = filterSidebarSections(user?.role, SECTIONS);

  return (
    <>
      <MobileToggle isOpen={isOpen} onToggle={toggle} />
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm md:hidden transition-opacity"
          onClick={close}
        />
      )}
      <aside
        className="fixed left-0 top-0 z-40 flex h-full w-[260px] flex-col bg-white/90 backdrop-blur-xl border-r border-slate-200/40 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-out md:translate-x-0"
        style={{ transform: isOpen ? 'translateX(0)' : undefined }}
      >
        <SidebarBrand />
        <SidebarNav sections={visibleSections} onItemClick={close} />
        <SidebarFooter />
      </aside>
    </>
  );
});
