"use client";

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSidebarStore } from '@/lib/stores/sidebar-store';

export function SidebarToggle() {
  const { isCollapsed, toggle } = useSidebarStore();

  return (
    <button
      onClick={toggle}
      className="hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200/70 bg-white/85 text-slate-400 shadow-sm transition-all hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 md:flex"
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
