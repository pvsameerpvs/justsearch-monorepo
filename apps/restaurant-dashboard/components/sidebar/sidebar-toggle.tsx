"use client";

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSidebarStore } from '@/lib/stores/sidebar-store';

export function SidebarToggle() {
  const { isCollapsed, toggle } = useSidebarStore();

  return (
    <button
      onClick={toggle}
      className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-100/60"
      title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {isCollapsed ? (
        <PanelLeftOpen className="h-4 w-4" />
      ) : (
        <PanelLeftClose className="h-4 w-4" />
      )}
    </button>
  );
}
