"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useDashboardAuth } from "@/lib/auth-context";
import { LogoutConfirmDialog } from "./dashboard/logout-confirm-dialog";

export function StaffTopBar() {
  const { user, logout } = useDashboardAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!user) return null;

  return (
    <>
      <div className="fixed right-4 top-4 z-50 flex items-center gap-3">
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
          {user.name}
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
      <LogoutConfirmDialog
        open={showConfirm}
        onConfirm={() => { setShowConfirm(false); logout(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
