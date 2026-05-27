"use client";

import { LogOut } from 'lucide-react';
import { SidebarUserAvatar } from './sidebar-user-avatar';
import { DEFAULT_ROLE_META, ROLE_META } from './sidebar-user-meta';

interface SidebarUserCardProps {
  collapsed: boolean;
  initials: string;
  mounted: boolean;
  name: string;
  role: string;
  onLogoutClick: () => void;
}

export function SidebarUserCard({
  collapsed,
  initials,
  mounted,
  name,
  role,
  onLogoutClick,
}: SidebarUserCardProps) {
  const meta = ROLE_META[role] ?? DEFAULT_ROLE_META;
  const RoleIcon = meta.icon;
  const logoutButton = (
    <button
      onClick={onLogoutClick}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-400 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
      title="Logout"
    >
      <LogOut className="h-3.5 w-3.5" />
    </button>
  );

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-3">
        <SidebarUserAvatar color={meta.color} initials={initials} mounted={mounted} />
        {logoutButton}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/80 bg-white/80 p-3 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.7)] ring-1 ring-amber-100/60">
      <div className="flex items-center gap-3">
        <SidebarUserAvatar color={meta.color} initials={initials} mounted={mounted} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-black text-slate-900">{mounted ? name : 'User'}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <RoleIcon className="h-3 w-3 text-amber-500" />
            <p className="text-[10px] font-bold uppercase text-slate-400">{mounted ? meta.label : 'Staff'}</p>
          </div>
        </div>
        {logoutButton}
      </div>
    </div>
  );
}
