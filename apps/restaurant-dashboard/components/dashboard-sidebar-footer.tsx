"use client";

import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useDashboardAuth } from "@/lib/auth-context";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function SidebarFooter() {
  const { user, logout } = useDashboardAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const name = user?.name ?? 'User';
  const role = user?.role ?? 'staff';
  const initials = getInitials(name);

  return (
    <div className="border-t border-white/5 p-3">
      <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-500">
          {mounted ? initials : 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">{mounted ? name : 'User'}</p>
          <p className="text-[10px] text-slate-500 capitalize">{mounted ? role.replace('_', ' ') : 'Staff'}</p>
        </div>
        <button
          onClick={logout}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-white/10 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
