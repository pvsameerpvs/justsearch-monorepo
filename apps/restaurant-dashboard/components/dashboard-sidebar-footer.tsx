"use client";

import { useState, useEffect } from "react";
import { LogOut, Crown } from "lucide-react";
import { useDashboardAuth } from "@/lib/auth-context";
import { LogoutConfirmDialog } from "./dashboard/logout-confirm-dialog";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const ROLE_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  owner: { label: 'Owner', color: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white', icon: Crown },
  manager: { label: 'Manager', color: 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white', icon: Crown },
  cashier: { label: 'Cashier', color: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white', icon: Crown },
  kitchen_staff: { label: 'Kitchen', color: 'bg-gradient-to-br from-rose-400 to-pink-500 text-white', icon: Crown },
};

export function SidebarFooter() {
  const { user, logout } = useDashboardAuth();
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const name = user?.name ?? 'User';
  const role = user?.role ?? 'staff';
  const initials = getInitials(name);
  const meta = ROLE_META[role] ?? { label: 'Staff', color: 'bg-slate-200 text-slate-600', icon: Crown };
  const RoleIcon = meta.icon;

  return (
    <>
      <div className="border-t border-slate-100/60 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-100/60 p-3 shadow-sm">
          <div className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.color} shadow-md ring-2 ring-white`}>
            <span className="text-[10px] font-bold">{mounted ? initials : 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{mounted ? name : 'User'}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <RoleIcon className="h-2.5 w-2.5 text-slate-400" />
              <p className="text-[10px] font-semibold text-slate-400 capitalize">{mounted ? meta.label : 'Staff'}</p>
            </div>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm border border-slate-100/60 hover:border-red-200/60"
            title="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <LogoutConfirmDialog
        open={showConfirm}
        onConfirm={() => { setShowConfirm(false); logout(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
