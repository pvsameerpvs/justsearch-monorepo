"use client";

import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useAdminAuth } from "@/lib/auth-store";

export function AdminSidebarFooter() {
  const { user, logout } = useAdminAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const name = user?.name ?? 'Super Admin';
  const role = user?.role ?? 'super_admin';
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">
      <div className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-bold">
          {mounted ? initials : 'SA'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{mounted ? name : 'Super Admin'}</p>
          <p className="text-xs text-slate-400 capitalize">{mounted ? role.replace('_', ' ') : 'Super Admin'}</p>
        </div>
        <button
          onClick={logout}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
