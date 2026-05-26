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
    <div className="border-t border-slate-100 p-3">
      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
        <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">
          {mounted ? initials : 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-700 truncate">{mounted ? name : 'User'}</p>
          <p className="text-[10px] text-slate-400 capitalize">{mounted ? role.replace('_', ' ') : 'Staff'}</p>
        </div>
        <button
          onClick={logout}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
