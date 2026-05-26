"use client";

import { memo, useState, useCallback } from 'react';
import { SidebarFooter } from './dashboard-sidebar-footer';
import { MobileToggle } from './mobile-toggle';
import { SidebarBrand } from './sidebar-brand';
import { SidebarNav, SECTIONS } from './sidebar-nav';
import { SidebarToggle } from './sidebar/sidebar-toggle';
import { useDashboardAuth } from '@/lib/auth-context';
import { filterSidebarSections } from '@/lib/utils/role-guards';
import { useSidebarStore } from '@/lib/stores/sidebar-store';

export const DashboardSidebar = memo(function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMobile = useCallback(() => setIsOpen((p) => !p), []);
  const closeMobile = useCallback(() => setIsOpen(false), []);
  const { user } = useDashboardAuth();
  const visibleSections = filterSidebarSections(user?.role, SECTIONS);
  const { isCollapsed } = useSidebarStore();

  return (
    <>
      <MobileToggle isOpen={isOpen} onToggle={toggleMobile} />
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm md:hidden transition-opacity"
          onClick={closeMobile}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full flex-col bg-white/90 backdrop-blur-xl border-r border-slate-200/40 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out w-[260px] ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${isCollapsed ? 'md:w-[72px]' : 'md:w-[260px]'}`}
      >
        <div className={`flex items-center justify-between border-b border-slate-100/60 ${isCollapsed ? 'px-2 py-3' : 'px-4 py-3'}`}>
          <SidebarBrand collapsed={isCollapsed} />
          <SidebarToggle />
        </div>
        <SidebarNav sections={visibleSections} collapsed={isCollapsed} onItemClick={closeMobile} />
        <SidebarFooter collapsed={isCollapsed} />
      </aside>
    </>
  );
});
