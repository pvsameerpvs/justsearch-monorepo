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
        className={`fixed left-0 top-0 z-40 flex h-full w-[280px] max-w-[calc(100vw-1.5rem)] flex-col border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#fffaf4_45%,#f8fafc_100%)] shadow-[18px_0_45px_-30px_rgba(15,23,42,0.55)] backdrop-blur-2xl transition-all duration-300 ease-out md:left-3 md:top-3 md:h-[calc(100%-1.5rem)] md:rounded-3xl md:shadow-[0_24px_70px_-42px_rgba(15,23,42,0.55)] ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${isCollapsed ? 'md:w-[80px]' : 'md:w-[280px]'}`}
      >
        <div className={`border-b border-amber-100/70 ${isCollapsed ? 'flex flex-col items-center gap-3 px-3 py-4' : 'flex items-center justify-between gap-3 px-4 py-4'}`}>
          <SidebarBrand collapsed={isCollapsed} />
          <SidebarToggle />
        </div>
        <SidebarNav sections={visibleSections} collapsed={isCollapsed} onItemClick={closeMobile} />
        <SidebarFooter collapsed={isCollapsed} />
      </aside>
    </>
  );
});
